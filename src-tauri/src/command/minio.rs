use crate::command::command_response::CommandResponse;
use crate::helper::minio_helper::MinioHelper;
use crate::shared_preferences::MinioConfig;

#[tauri::command]
pub async fn minio_upload(
    config: MinioConfig,
    paths: Vec<String>,
    bucket: String,
) -> Result<CommandResponse<Vec<String>>, String> {
    let mut result: CommandResponse<Vec<String>> = CommandResponse::default();

    
    let server_paths = match MinioHelper::save_files(&config, &bucket, paths).await {
        Ok(paths) => paths,
        Err(err) => {
            result.set_success(false);
            result.set_message(err);
            return Ok(result);
        }
    };
    result.set_data(server_paths);
    Ok(result)
}
