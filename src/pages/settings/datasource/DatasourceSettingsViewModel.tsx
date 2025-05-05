import {PGDatabaseHelper} from "@helpers/PGDatabaseHelper";
import {StoreHelper} from "@helpers/StoreHelper";
import {ToastHelper} from "@helpers/ToastHelper";
import {PreferencesKey} from "@models/PreferencesModel";
import {useEffect, useState} from "react";


interface StoredDatasource {
    host: string
    port: string
    username: string
    password: string
    database: string
}

export function useDatasourceSettingsViewModel() {
    const [host, setHost] = useState('')
    const [port, setPort] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [database, setDatabase] = useState('')


    useEffect(() => {
        async function loadStoredDatasource() {
            const datasource = await StoreHelper.getStoreValue<StoredDatasource>(PreferencesKey.DATASOURCE_CONFIG)
            if (datasource) {
                setHost(datasource.host)
                setPort(datasource.port)
                setUsername(datasource.username)
                setPassword(datasource.password)
                setDatabase(datasource.database)
            }
        }

        loadStoredDatasource().then(() => {
        })
    }, [])

    async function testConnection() {
        let result = await PGDatabaseHelper.testConnection({
            host: host,
            port: port,
            username: username,
            password: password,
            database: database
        })
        if (result) {
            await ToastHelper.success('连接成功')
        } else {
            await ToastHelper.error('连接失败')
        }
    }

    function validateDatasource() {
        if (!host) {
            ToastHelper.error('主机地址不能为空').then(() => {
            })
            return false
        }
        if (!port) {
            ToastHelper.error('端口号不能为空').then(() => {
            })
            return false
        }
        if (!username) {
            ToastHelper.error('用户名不能为空').then(() => {
            })
            return false
        }
        if (!password) {
            ToastHelper.error('密码不能为空').then(() => {
            })
            return false
        }
        if (!database) {
            ToastHelper.error('数据库名不能为空').then(() => {
            })
            return false
        }
        return true
    }

    async function saveDatasource() {
        try {
            if (!validateDatasource()) {
                return
            }
            await StoreHelper.setStoreValue(PreferencesKey.DATASOURCE_CONFIG, {
                host: host,
                port: port,
                username: username,
                password: password,
                database: database
            })
            await ToastHelper.success('保存成功')
        } catch (e) {
            await ToastHelper.error('保存失败')
        }

    }

    return {
        host, setHost,
        port, setPort,
        username, setUsername,
        password, setPassword,
        database, setDatabase,
        testConnection,
        saveDatasource
    }

}