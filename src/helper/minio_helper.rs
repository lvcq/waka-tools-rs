use crate::shared_preferences::MinioConfig;
use std::collections::HashMap;

use minio_rsc::{provider::StaticProvider, Minio};
use tokio::fs::{metadata, File};
use tokio::io::{AsyncReadExt, BufReader};

use minio_rsc::client::KeyArgs;

#[derive(Debug, Default)]
pub struct MinioHelper {}

impl MinioHelper {
    pub async fn save_files(
        config: &MinioConfig,
        directory: &str,
        files: Vec<String>,
    ) -> Result<Vec<String>, String> {
        let mut results: Vec<String> = Vec::with_capacity(files.len());
        let provider = StaticProvider::new(&config.key_id, &config.secret_key, None);

        let client = Minio::builder()
            .endpoint(&config.endpoint)
            .provider(provider)
            .secure(false)
            .build()
            .unwrap();
        let (tx, mut rx) = tokio::sync::mpsc::channel::<(usize, String)>(files.len());
        for (index, file_path) in files.iter().enumerate() {
            let client = client.clone();
            let dir = directory.to_string();
            let tx = tx.clone();
            let file_path = file_path.clone();
            let config = config.clone();

            tokio::spawn(async move {
                let message = {
                    send_file_to_minio(&client, config, dir, file_path)
                        .await
                        .unwrap_or_else(|_| "".to_string())
                };

                tx.send((index, message)).await.unwrap();
            });
        }

        while let Some((index, message)) = rx.recv().await {
            results.insert(index, message);
        }

        Ok(results)
    }
}

async fn send_file_to_minio(
    client: &Minio,
    config: MinioConfig,
    directory: String,
    file_path: String,
) -> Result<String, String> {
    let metadata = match metadata(&file_path).await {
        Ok(m) => m,
        Err(_) => return Err(format!("文件 {} 不存在", &file_path)),
    };
    if metadata.is_dir() {
        return Err("只能上传文件".to_string());
    }
    let file_hash = get_file_hash(&file_path).await?;
    let extension = std::path::Path::new(&file_path)
        .extension()
        .unwrap()
        .to_str()
        .unwrap();

    let save_path = if extension.is_empty() {
        format!("{}/{}", &directory, &file_hash)
    } else {
        {}
        format!("{}/{}.{}", &directory, &file_hash, &extension)
    };

    let meta: HashMap<String, String> = [("filename".to_owned(), save_path.clone())].into();

    let key: KeyArgs = KeyArgs::new(save_path.clone()).metadata(meta);

    client
        .fput_object(&config.bucket, key, &file_path)
        .await
        .map_err(|_err| "上传文件失败".to_string())?;
    Ok(save_path)
}

async fn get_file_hash(file_path: &str) -> Result<String, String> {
    let file = File::open(file_path)
        .await
        .map_err(|err| format!("无法打开文件: {}", err))?;
    let mut hasher = blake3::Hasher::new();
    let mut reader = BufReader::new(file);

    let mut buffer = [0; 1024];

    loop {
        let count = reader
            .read(&mut buffer)
            .await
            .map_err(|_err| "读取文件失败".to_string())?;
        if count == 0 {
            break;
        }
        hasher.update(&buffer[0..count]);
    }
    Ok(hasher.finalize().to_hex().to_string())
}
