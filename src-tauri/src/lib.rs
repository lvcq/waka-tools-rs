pub(crate) mod app_state;
pub(crate) mod command;
pub(crate) mod helper;
pub(crate) mod shared_preferences;

use app_state::image_cache::ImageCache;
use app_state::AppState;
use command::cropper::create_cropper_thumbnail;
use command::minio::minio_upload;
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(
            // tauri_plugin_log::Builder::new()
            //     .target(tauri_plugin_log::Target::new(
            //         tauri_plugin_log::TargetKind::LogDir {
            //             file_name: Some("logs".to_string()),
            //         },
            //     ))
            //     .build(),
            tauri_plugin_log::Builder::new()
                .target(tauri_plugin_log::Target::new(
                    tauri_plugin_log::TargetKind::Stdout,
                ))
                .build(),
        )
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let resource_dir = app.path().resource_dir().unwrap();
            let image_cache = ImageCache::new(
                &resource_dir,
                500,
                1024 * 1024 * 1024 * 4, // 4GB
            );

            app.manage(AppState { image_cache });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            minio_upload,
            create_cropper_thumbnail
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
