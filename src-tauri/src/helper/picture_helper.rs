use opencv::{
    imgcodecs::{imread,imencode},
    core::{Mat, Rect},
};


#[derive(Clone,serde::Serialize,serde::Deserialize)]
pub struct  CropValues{
    pub x: i32,
    pub y: i32,
    pub width: i32,
    pub height: i32,
}

pub struct PictureHelper ();


impl PictureHelper {
    pub fn crop_picture(picture:&str,values:&CropValues)->Result<Vec<u8>, String> {
        let img = imread(picture, opencv::imgcodecs::IMREAD_COLOR).map_err(|_err| "读取图片失败".to_string())?;
        let rect = Rect::new(values.x, values.y, values.width, values.height);
        let cropped_img = Mat::roi(&img, rect).map_err(|_err| "裁剪图片失败".to_string())?;
        let mut png_bytes =  opencv::core::Vector::new();
        imencode(".png", &cropped_img, &mut png_bytes, &opencv::core::Vector::new()).map_err(|_err| "转换图片失败".to_string())?;
        let png_bytes = png_bytes.as_slice();
        Ok(png_bytes.to_vec())

    }  

}