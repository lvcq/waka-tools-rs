use opencv::{
    core::{Mat, MatTraitConst, Rect, Size, Vector},
    imgcodecs::{imdecode, imencode, imread, ImreadModes},
    imgproc,
};

use crate::{app_state::image_cache::ImageCache, shared_preferences::MinioConfig};

#[derive(Clone, serde::Serialize, serde::Deserialize)]
pub struct CropValues {
    pub x: i32,
    pub y: i32,
    pub width: i32,
    pub height: i32,
}

pub struct PictureHelper();

impl PictureHelper {
    pub fn crop_picture(picture: &str, values: &CropValues) -> Result<Vec<u8>, String> {
        let img = Self::load_local_img(picture)?;
        let img = PictureHelper::crop(&img, values)?;
        PictureHelper::translate_img_to_u8_vec(&img)
    }

    /// 裁剪图片生成缩略图，缩略图最大宽度不超过设定值
    pub fn crop_thumbnail_picture(
        picture: &str,
        values: &CropValues,
        max_width: i32,
    ) -> Result<Vec<u8>, String> {
        let img = Self::load_local_img(picture)?;
        let mut img = PictureHelper::crop(&img, values)?;
        let width = img.cols();
        if width > max_width {
            let scale_factor = (max_width as f64) / (width as f64);
            img = PictureHelper::scale(&img, scale_factor)?;
        }
        PictureHelper::translate_img_to_u8_vec(&img)
    }

    fn load_local_img(img_path: &str) -> Result<Mat, String> {
        let img = imread(img_path, opencv::imgcodecs::IMREAD_COLOR)
            .map_err(|_err| "读取图片失败".to_string())?;
        Ok(img)
    }

    fn load_vec_u8_img(data: Vec<u8>) -> Result<Mat, String> {
        let img_data: Vector<u8> = Vector::from_slice(data[..].as_ref());
        let img = imdecode(&img_data, ImreadModes::IMREAD_COLOR as i32)
            .map_err(|_e| "图片转化错误".to_string())?;
        if img.empty() {
            Err("图片数据为空".to_string())
        } else {
            Ok(img)
        }
    }

    /// 裁剪图片
    fn crop(picture: &Mat, values: &CropValues) -> Result<Mat, String> {
        let rect: Rect = Rect::new(values.x, values.y, values.width, values.height);
        let cropped_img = Mat::roi(picture, rect).map_err(|_err| "裁剪图片失败".to_string())?;
        Ok(cropped_img.clone_pointee())
    }

    /// 将图片转换为png格式的 u8 array
    fn translate_img_to_u8_vec(img: &Mat) -> Result<Vec<u8>, String> {
        let mut png_bytes = opencv::core::Vector::new();
        imencode(".png", img, &mut png_bytes, &opencv::core::Vector::new())
            .map_err(|_err| "转换图片失败".to_string())?;
        let png_bytes = png_bytes.as_slice();
        Ok(png_bytes.to_vec())
    }

    /// 缩放图片
    fn scale(img: &Mat, factor: f64) -> Result<Mat, String> {
        let mut scaled_img = Mat::default();
        imgproc::resize(
            &img,                  // Input image
            &mut scaled_img,       // Output image
            Size::default(),       // Size (ignored when using fx/fy)
            factor,                // fx (scale factor for width)
            factor,                // fy (scale factor for height)
            imgproc::INTER_LINEAR, // Interpolation method
        )
        .map_err(|_e| "缩放图片失败".to_string())?;
        return Ok(scaled_img);
    }

    /// 获取图片数据
    /// 第一步：从图片缓存中读取数据，如果在缓存中找到，直接返回图片
    /// 第二步：如果缓存中不存在，从minio中获取
    pub fn fetch_remote_image(
        imageCache: &ImageCache,
        config: &MinioConfig,
        bucket: &str,
        file_name: &str,
    ) {
    }
}
