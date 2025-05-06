use crate::{
    helper::{
        minio_helper::MinioHelper,
        picture_helper::{CropValues, PictureHelper},
    },
    shared_preferences::MinioConfig,
};

use super::command_response::CommandResponse;
/// 创建裁剪器缩略图，并上传到minio，并返回url
/// 如果是远程图片，需要先下载到本地，然后裁剪，最后上传到minio
#[tauri::command]
pub async fn create_cropper_thumbnail(
    picture: String,
    is_local:bool,
    cropper: CropValues,
    config: MinioConfig,
) -> Result<CommandResponse<String>, String> {
    let mut result: CommandResponse<String> = CommandResponse::default();
    if (!is_local) {
    /// 远程图片需要下载到本地再处理
    let a=1;
    }
    let thumbnail = if let Ok(thumb) = PictureHelper::crop_thumbnail_picture(&picture, &cropper,200) {
        thumb
    } else {
        result.set_success(false);
        result.set_message("裁剪图片失败".to_string());
        return Ok(result);
    };

    // 上传到minio
    let url = if let Ok(visit_url)= MinioHelper::upload_bytes(thumbnail, ".png", &config).await{
        visit_url
    }else{
        result.set_success(false);
        result.set_message("上传图片失败".to_string());
        return Ok(result);
    };

    result.set_data(url);
    Ok(result)
}
