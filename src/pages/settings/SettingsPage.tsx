import {NormalPage} from "@components/pageLayouts/NormalPage";
import {DatasourceSettings} from "./datasource/DatasourceSettings";
import {Blank} from "@components/base/Blank.tsx";
import {MinioSettings} from "@pages/settings/minio/MinioSettings.tsx";

export function SettingsPage() {
    return (
        <NormalPage>
            <DatasourceSettings/>
            <Blank height="20px"/>
            <MinioSettings/>
        </NormalPage>
    )
}