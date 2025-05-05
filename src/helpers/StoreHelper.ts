import { PreferencesKey } from '@models/PreferencesModel';
import { LazyStore } from '@tauri-apps/plugin-store';

/**
 * 配置存储工具类
 */
class StoreHelperImpl{
    private static instance:StoreHelperImpl;
    
    private store:LazyStore
    static getStore(){
        if(!StoreHelperImpl.instance){
            StoreHelperImpl.instance=new StoreHelperImpl();
        }
        return StoreHelperImpl.instance;
    }
    private constructor(){
        this.store = new LazyStore('preferences.json')
    }
    async getStoreValue<T=any>(key:PreferencesKey):Promise<T|undefined>{
        return await this.store.get(key);
    }

    async setStoreValue<T=any>(key:PreferencesKey,value:T):Promise<void>{
        await this.store.set(key,value);
    }

}

export const StoreHelper=StoreHelperImpl.getStore();