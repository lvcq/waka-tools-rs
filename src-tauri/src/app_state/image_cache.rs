use log::error;
use lru::LruCache;
use serde::{Deserialize, Serialize};
use std::{
    collections::HashMap,
    num::NonZeroUsize,
    path::PathBuf,
    sync::Mutex,
    time::{SystemTime, UNIX_EPOCH},
};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ImageCacheMetaItem {
    original_path: String,
    cache_path: String,
    last_accessed: u128,
    size: u64,
}

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ImageCacheMeta {
    items: HashMap<String, ImageCacheMetaItem>,
}

#[derive(Debug)]
pub struct ImageCache {
    resource_dir: PathBuf,
    memory_cache: Mutex<LruCache<String, Vec<u8>>>,
    meta: Mutex<ImageCacheMeta>,
    cache_dir: PathBuf,
    max_memory_items: usize,
    max_disk_size: u64,
}

const CACHE_META_FILE_NAME: &str = "cache_meta.toml";

impl ImageCache {
    pub fn new(resource_dir: &PathBuf, max_memory_items: usize, max_disk_size: u64) -> Self {
        let mut img_cache_dir = resource_dir.clone();
        img_cache_dir.push("img_cache");

        let meta_path = img_cache_dir.join(CACHE_META_FILE_NAME);

        let meta = if meta_path.exists() {
            match std::fs::read_to_string(meta_path) {
                Ok(meta_str) => toml::from_str::<ImageCacheMeta>(&meta_str).unwrap_or_default(),
                _ => ImageCacheMeta::default(),
            }
        } else {
            ImageCacheMeta::default()
        };
        let items_count: NonZeroUsize = if max_memory_items > 0 {
            NonZeroUsize::new(max_memory_items).unwrap()
        } else {
            NonZeroUsize::new(100).unwrap()
        };
        Self {
            resource_dir: resource_dir.clone(),
            memory_cache: Mutex::new(LruCache::new(items_count)),
            meta: Mutex::new(meta),
            cache_dir: img_cache_dir,
            max_memory_items,
            max_disk_size,
        }
    }

    /// 生成路径 hash
    fn hash_path(&self, img_path: &str) -> String {
        let mut hasher = blake3::Hasher::new();
        hasher.update(img_path.as_bytes());
        hasher.finalize().to_hex().to_string()
    }

    /// 获取图片 - 优先从内存缓存，然后磁盘缓存，最后原始路径
    pub fn get_image(&self, original_path: &str) -> Option<Vec<u8>> {
        let path_hash = self.hash_path(original_path);
        // 1. 检查内存缓存
        {
            let mut memory_cache = self.memory_cache.lock().unwrap();
            if let Some(data) = memory_cache.get(&path_hash) {
                self.update_last_accessed(&path_hash);
                return Some(data.clone());
            }
        }

        // 2. 检查磁盘缓存
        {
            let meta = self.meta.lock().unwrap();
            if let Some(meta_item) = meta.items.get(&path_hash) {
                let stored_path = self.cache_dir.join(&meta_item.cache_path);
                if let Ok(data) = std::fs::read(&stored_path) {
                    // 放入内存缓存
                    let mut memory_cache = self.memory_cache.lock().unwrap();
                    memory_cache.put(path_hash.clone(), data.clone());

                    // 更新最后访问时间
                    drop(meta); // 释放锁以便更新
                    self.update_last_accessed(&path_hash);

                    return Some(data);
                } else {
                    None
                }
            } else {
                None
            }
        }
    }

    /// 缓存图片信息
    pub fn cache_image(&self, original_path: &str, data: Vec<u8>) -> Result<(), String> {
        let path_hash = self.hash_path(original_path);
        let size = data.len() as u64;
        // 1. 存入内存
        {
            let mut memory_cache = self.memory_cache.lock().unwrap();
            memory_cache.put(path_hash.clone(), data.clone());
        }

        // 2. 存入磁盘

        let cache_path = format!("{}.cache", path_hash);
        let full_cache_path = self.cache_dir.join(&cache_path);
        if !self.cache_dir.exists() {
            // 缓存目录不存在时，创建缓存目录
            std::fs::create_dir_all(&self.cache_dir).unwrap()
        }
        std::fs::write(full_cache_path, data).map_err(|_e| "保存图片至缓存文件失败".to_string())?;

        // 3. 更新元数据
        let mut meta = self.meta.lock().unwrap();
        meta.items.insert(
            path_hash.clone(),
            ImageCacheMetaItem {
                original_path: original_path.to_string(),
                cache_path,
                last_accessed: self.get_timestemp(),
                size,
            },
        );

        // 4. 保存元数据
        self.save_meta(&meta)?;

        // 5. 检查磁盘缓存大小，必要时清理
        self.cleanup_disk_cache()?;
        Ok(())
    }

    fn save_meta(&self, meta: &ImageCacheMeta) -> Result<(), String> {
        let meta_path = self.cache_dir.join(CACHE_META_FILE_NAME);
        if !self.cache_dir.exists() {
            std::fs::create_dir_all(&self.cache_dir).unwrap()
        }
        let meta_str = toml::to_string(meta).unwrap();
        std::fs::write(meta_path, meta_str).map_err(|_e| "保存元数据到磁盘失败".to_string())?;
        Ok(())
    }

    fn update_last_accessed(&self, path_hash: &str) {
        let mut meta = self.meta.lock().unwrap();
        if let Some(item) = meta.items.get_mut(path_hash) {
            item.last_accessed = self.get_timestemp();

            // 异步保存元数据变更
            let meta_clone = meta.clone();
            let cache_dir = self.cache_dir.clone();
            std::thread::spawn(move || {
                let meta_path = cache_dir.join(CACHE_META_FILE_NAME);
                let meta_str = toml::to_string(&meta_clone).unwrap();
                let _ = std::fs::write(meta_path, meta_str);
            });
        }
    }

    fn cleanup_disk_cache(&self) -> Result<(), String> {
        let mut meta = self.meta.lock().unwrap();

        // 计算总大小
        let total_size: u64 = meta.items.values().map(|item| item.size).sum();
        if total_size < self.max_disk_size {
            return Ok(());
        }

        // 需要清理，按照最后访问时间排序

        let mut items: Vec<(String, ImageCacheMetaItem)> = meta
            .items
            .iter()
            .map(|(key, value)| (key.clone(), value.clone()))
            .collect();
        items.sort_by(|a, b| a.1.last_accessed.cmp(&b.1.last_accessed));
        let mut current_size = total_size;
        let target_size = self.max_disk_size * 8 / 10;
        while current_size > target_size && !items.is_empty() {
            let (hash, item) = items.remove(0);
            //删除文件
            let file_path = self.cache_dir.join(&item.cache_path);
            if let Err(e) = std::fs::remove_file(&file_path) {
                error!("删除缓存图片失败");
                continue;
            }

            // 从元数据中移除
            meta.items.remove(&hash.clone());
            current_size -= item.size;
        }

        // 保存更新后的元数据
        self.save_meta(&meta)?;

        Ok(())
    }

    fn get_timestemp(&self) -> u128 {
        SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_millis()
    }
}
