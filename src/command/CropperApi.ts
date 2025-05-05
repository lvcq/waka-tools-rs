import { StoreHelper } from "@helpers/StoreHelper";
import { IMinioSettingsModel } from "@models/MinioModel";
import { PreferencesKey } from "@models/PreferencesModel";


export async function createCropperThumbnail() {
            let minioConfig = await StoreHelper.getStoreValue<IMinioSettingsModel>(PreferencesKey.MINIO_CONFIG);
            if (!minioConfig) {
                throw new Error('未配置Minio服务器');
            }
    
}

// picture: String,
// is_local: bool,
// cropper: CropValues,
// config: MinioConfig,