import { StoreHelper } from "@helpers/StoreHelper";
import { IMinioSettingsModel } from "@models/MinioModel";
import { PreferencesKey } from "@models/PreferencesModel";
import { CropValues } from "@models/CropperModel"
import { CommandResponse } from "@hooks/CommandResponse";
import { invoke } from "@tauri-apps/api/core";

/**
 * 创建裁剪器缩略图
 */
export async function createCropperThumbnail(picture: string, cropper: CropValues, isLocal: boolean): Promise<CommandResponse<string>> {
    let minioConfig = await StoreHelper.getStoreValue<IMinioSettingsModel>(PreferencesKey.MINIO_CONFIG);
    if (!minioConfig) {
        throw new Error('未配置Minio服务器');
    }

    return invoke('create_cropper_thumbnail', {
        picture,
        cropper,
        isLocal,
        config: minioConfig
    })

}