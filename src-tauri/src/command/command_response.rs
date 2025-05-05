use serde::Serialize;

/// 通用命令返回结构
///
#[derive(Debug, Serialize)]
pub struct CommandResponse<T>
where
    T: Serialize + Default,
{
    success: bool,
    data: Option<T>,
    message: Option<String>,
}

impl<T> Default for CommandResponse<T>
where
    T: Serialize + Default + Default,
{
    fn default() -> Self {
        Self {
            success: true,
            data: None,
            message: None,
        }
    }
}

impl<T> CommandResponse<T>
where
    T: Serialize + Default + Default,
{
    /// 设置是否成功
    pub fn set_success(&mut self, success: bool) {
        self.success = success;
    }

    /// 设置返回数据
    pub fn set_data(&mut self, data: T) {
        self.data = Some(data);
    }

    /// 设置返回的消息
    pub fn set_message(&mut self, message: String) {
        self.message = Some(message);
    }
}
