use image_cache::ImageCache;

pub mod image_cache;

/// 应用状态
#[derive(Debug, Default)]
pub struct AppState {
    pub image_cache: ImageCache
}
