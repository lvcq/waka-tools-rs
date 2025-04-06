pub(crate) mod app_state;
pub(crate) mod command;
pub(crate) mod helper;
pub(crate) mod shared_preferences;

use app_state::AppState;
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
                .build()
        )
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            app.manage(AppState::default());
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![minio_upload])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
