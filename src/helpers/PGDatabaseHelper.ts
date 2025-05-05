import Database from '@tauri-apps/plugin-sql';
import { error } from '@tauri-apps/plugin-log';



interface PGConnConfig {
    host: string;
    port: string;
    database: string;
    username: string;
    password: string;
}

/**
 * Postgres数据库工具类
 */
class PGDatabaseHelperImpl {
    private static instance: PGDatabaseHelperImpl;
    static getInstance() {
        if (!PGDatabaseHelperImpl.instance) {
            PGDatabaseHelperImpl.instance = new PGDatabaseHelperImpl();
        }
        return PGDatabaseHelperImpl.instance;
    }
    private constructor() {

    }
    async testConnection(config: PGConnConfig): Promise<boolean> {
        try {
            const connectionString = this.getConnectionString(config);
            const db = await Database.load(connectionString);
            const res = await db.execute('SELECT $1::text as message', ['Hello, PostgreSQL!']);
            await db.close();
            return res.rowsAffected > 0;
        } catch (e) {
            error(`连接数据库失败:${e}`);
            return false;
        }
    }

    private getConnectionString(config: PGConnConfig): string {
        return `postgres://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`
    }
}

export const PGDatabaseHelper = PGDatabaseHelperImpl.getInstance();