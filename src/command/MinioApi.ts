import {invoke} from "@tauri-apps/api/core";
import {StoreHelper} from "@helpers/StoreHelper";
import {PreferencesKey} from "@models/PreferencesModel";
import {IMinioSettingsModel} from "@models/MinioModel";
import {CommandResponse} from "@hooks/CommandResponse";


export class MinioApi {
    static async uploadFiles(files: string[], bucket: string): Promise<CommandResponse<string[]>> {
        let minioConfig = await StoreHelper.getStoreValue<IMinioSettingsModel>(PreferencesKey.MINIO_CONFIG);
        if (!minioConfig) {
            throw new Error('未配置Minio服务器');
        }
        return invoke('minio_upload', {
            config: minioConfig,
            paths: files,
            bucket: bucket,
        })
    }
}


