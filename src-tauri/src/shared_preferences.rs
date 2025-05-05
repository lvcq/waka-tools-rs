use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct SharedPreferences {
    #[serde(rename = "minioConfig")]
    pub minio_config: Option<MinioConfig>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct MinioConfig {
    pub endpoint: String,
    #[serde(rename = "bucketName")]
    pub bucket_name: String,
    #[serde(rename = "accessKey")]
    pub access_key: String,
    #[serde(rename = "secretKey")]
    pub secret_key: String,
}
