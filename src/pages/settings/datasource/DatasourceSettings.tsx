import {Blank} from "@components/base/Blank";
import {Space} from "@components/base/Space";
import {Button, Field, Input, makeStyles} from "@fluentui/react-components";
import {useDatasourceSettingsViewModel} from "./DatasourceSettingsViewModel";

const useStyles = makeStyles({
    form: {
        maxWidth: '400px',
    }
})

export function DatasourceSettings() {
    const styles = useStyles()
    const viewModel = useDatasourceSettingsViewModel()
    
    return (
        <div>
            <h3>数据源设置</h3>
            <Blank height="12px"/>
            <form className={styles.form}>
                <Field label="主机地址">
                    <Input placeholder="请输入主机地址" value={viewModel.host}
                           onChange={(event) => viewModel.setHost(event.target.value)}/>

                </Field>
                <Field label="端口号">
                    <Input placeholder="请输入端口号" value={viewModel.port}
                           onChange={(event) => viewModel.setPort(event.target.value)}/>
                </Field>
                <Field label="数据库名">
                    <Input placeholder="请输入数据库名" value={viewModel.database}
                           onChange={(event) => viewModel.setDatabase(event.target.value)}/>
                </Field>
                <Field label="用户名">
                    <Input placeholder="请输入用户名" value={viewModel.username}
                           onChange={(event) => viewModel.setUsername(event.target.value)}/>
                </Field>
                <Field label="密码">
                    <Input placeholder="请输入密码" value={viewModel.password}
                           type="password"
                           onChange={(event) => viewModel.setPassword(event.target.value)}/>
                </Field>
                <Blank height="8px"/>
                <Space direction="row" space={16} align="end">
                    <Button appearance="outline" onClick={() => {
                        viewModel.testConnection().then(() => {
                        })
                    }}>测试连接</Button>
                    <Button appearance="primary"
                            onClick={() => {
                                viewModel.saveDatasource().then(() => {
                                })
                            }}
                    >保存</Button>
                </Space>
            </form>
        </div>
    )
}