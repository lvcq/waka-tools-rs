use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct SharedPreferences {
    #[serde(rename = "minioConfig")]
    pub minio_config: Option<MinioConfig>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct MinioConfig {
    pub endpoint: String,
    pub bucket: String,
    #[serde(rename = "keyId")]
    pub key_id: String,
    #[serde(rename = "secretKey")]
    pub secret_key: String,
}

