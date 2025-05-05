import {useCallback, useEffect, useState} from "react";
import {StoreHelper} from "@helpers/StoreHelper.ts";
import {PreferencesKey} from "@models/PreferencesModel.ts";
import {ToastHelper} from "@helpers/ToastHelper.ts";
import {IMinioSettingsModel} from "@models/MinioModel.ts";
import {info} from "@tauri-apps/plugin-log"


export function useMinioSettingsViewModel() {
    const [endpoint, setEndpoint] = useState<string>("");
    const [accessKey, setAccessKey] = useState<string>("");
    const [secretKey, setSecretKey] = useState<string>("");
    const [bucketName, setBucketName] = useState<string>("");
    useEffect(() => {
        async function readConfig() {
            let config = await StoreHelper.getStoreValue<IMinioSettingsModel>(PreferencesKey.MINIO_CONFIG);
            setEndpoint(config?.endpoint ?? '');
            setAccessKey(config?.accessKey ?? '');
            setSecretKey(config?.secretKey ?? '');
            setBucketName(config?.bucketName ?? '');
        }

        readConfig().then(() => {
        });
    }, []);

    const saveConfig = useCallback(async () => {
        try {
            let config: IMinioSettingsModel = {
                endpoint,
                accessKey,
                secretKey,
                bucketName,
            }
            info(JSON.stringify(config));
            await StoreHelper.setStoreValue(PreferencesKey.MINIO_CONFIG, config)
            ToastHelper.success("保存成功").then(() => {

            })
        } catch {
            ToastHelper.error("保存失败").then(() => {
            })
        }

    }, [endpoint, accessKey, secretKey, bucketName])

    return {
        endpoint,
        setEndpoint,
        accessKey,
        setAccessKey,
        secretKey,
        setSecretKey,
        bucketName,
        setBucketName,
        saveConfig
    }
}