import {Blank} from "@components/base/Blank";
import {Button, Field, Input, makeStyles} from "@fluentui/react-components";
import {useMinioSettingsViewModel} from "@pages/settings/minio/MinioSettingsViewModel.ts";
import {Space} from "@components/base/Space.tsx";

const useStyles = makeStyles({
    form: {
        maxWidth: '400px',
    }
})

export function MinioSettings() {
    const {
        endpoint,
        setEndpoint,
        bucketName,
        setBucketName,
        accessKey,
        setAccessKey,
        secretKey,
        setSecretKey,
        saveConfig,
    } = useMinioSettingsViewModel()
    const styles = useStyles()

    return (
        <div>
            <h3>Minio设置</h3>
            <Blank height="12px"/>
            <form className={styles.form}>
                <Field label="Minio地址">
                    <Input placeholder="请输入Minio地址" value={endpoint}
                           onChange={(event) => setEndpoint(event.target.value)}/>
                </Field>
                <Field label="桶名">
                    <Input placeholder="请输入桶名" value={bucketName}
                           onChange={(event) => setBucketName(event.target.value)}/>
                </Field>
                <Field label="访问密钥(Access Key)">
                    <Input placeholder="请输入访问密钥" value={accessKey}
                           type="password"
                           onChange={(event) => setAccessKey(event.target.value)}/>
                </Field>
                <Field label="密钥(Secret Key)">
                    <Input placeholder="请输入密钥" value={secretKey}
                           type="password"
                           onChange={(event) => setSecretKey(event.target.value)}/>
                </Field>
                <Blank height="8px"/>
                <Space direction="row" space={16} align="end">
                    <Button appearance="primary"
                            onClick={() => {
                                saveConfig().then(() => {

                                })
                            }}
                    >保存</Button>
                </Space>
            </form>
        </div>
    )
}