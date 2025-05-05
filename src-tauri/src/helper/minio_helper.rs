use crate::shared_preferences::MinioConfig;
use bytes::Bytes;
use log::info;
use minio_rsc::client::KeyArgs;
use minio_rsc::{provider::StaticProvider, Minio};
use std::collections::HashMap;
use tokio::fs::{metadata, File};
use tokio::io::{AsyncReadExt, BufReader};

#[derive(Debug, Default)]
pub struct MinioHelper {}

impl MinioHelper {
    pub async fn save_files(
        config: &MinioConfig,
        bucket: &str,
        files: Vec<String>,
    ) -> Result<Vec<String>, String> {
        let mut results: Vec<String> = Vec::with_capacity(files.len());

        let client = create_minio_client(config)?;
        let (tx, mut rx) = tokio::sync::mpsc::channel::<(usize, String)>(files.len());
        for (index, file_path) in files.iter().enumerate() {
            let client = client.clone();
            let tx = tx.clone();
            let file_path = file_path.clone();
            let bucket = bucket.to_string();

            tokio::spawn(async move {
                let message = {
                    send_file_to_minio(&client, bucket, file_path)
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

    /// 上传字节数组到minio
    pub async fn upload_bytes(
        data: Vec<u8>,
        ext: &str,
        config: &MinioConfig,
    ) -> Result<String, String> {
        let client = create_minio_client(config)?;
        let result = send_bytes_to_minio(&client, &config.bucket_name, &data, ext).await?;
        Ok(result)
    }
}

async fn send_file_to_minio(
    client: &Minio,
    bucket: String,
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
        format!("{}", &file_hash)
    } else {
        {}
        format!("{}.{}", &file_hash, &extension)
    };

    let meta: HashMap<String, String> = [("filename".to_owned(), save_path.clone())].into();

    let key: KeyArgs = KeyArgs::new(save_path.clone()).metadata(meta);

    client
        .fput_object(&bucket, key, &file_path)
        .await
        .map_err(|err| {
            info!("上传文件失败: {}", err);
            "上传文件失败".to_string()
        })?;
    Ok(save_path)
}

async fn send_bytes_to_minio(
    client: &Minio,
    bucket: &str,
    data: &Vec<u8>,
    ext: &str,
) -> Result<String, String> {
    let file_hash = get_bytes_hash(&data).await?;
    let save_path = format!("{}.{}", &file_hash, &ext);
    let meta: HashMap<String, String> = [("filename".to_owned(), save_path.clone())].into();
    let key: KeyArgs = KeyArgs::new(save_path.clone()).metadata(meta);
    client
        .put_object(bucket, key, Bytes::from(data.clone()))
        .await
        .map_err(|err| {
            info!("上传文件失败: {}", err);
            "上传文件失败".to_string()
        })?;

    Ok(save_path)
}

/// 创建minio客户端
fn create_minio_client(config: &MinioConfig) -> Result<Minio, String> {
    let provider = StaticProvider::new(&config.access_key, &config.secret_key, None);
    let client = Minio::builder()
        .endpoint(&config.endpoint)
        .provider(provider)
        .secure(false)
        .build()
        .map_err(|err| format!("创建minio客户端失败: {}", err))?;
    Ok(client)
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

/// 获取字节数组的hash值
async fn get_bytes_hash(data: &[u8]) -> Result<String, String> {
    let mut hasher = blake3::Hasher::new();
    hasher.update(data);
    Ok(hasher.finalize().to_hex().to_string())
}
