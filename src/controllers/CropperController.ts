import {BodyType} from "@models/CropperModel";
import {convertFileSrc} from "@tauri-apps/api/core";
import {BehaviorSubject} from "rxjs";
import {MinioApi} from "@command/MinioApi";
import {info} from '@tauri-apps/plugin-log';

/**
 * 裁剪渲染模型
 */
export class CropperController {

    // 示例图片相关，示例图片分为远程图片和本地图片两种情况，如果是本地图片，在保存时，需要先上传到服务器，然后再保存到数据库中
    public sampleUrl: string = '';
    public isLocalSample: boolean = false;
    private sampleDisplayUrl = new BehaviorSubject<string>('');
    private sampleWidth: number = 0; // 示例图片宽度
    private sampleHeight: number = 0; // 示例图片高度
    private renderPanelWidth: number = 0; // 渲染面板宽度
    private renderPanelHeight: number = 0; // 渲染面板高度
    // 示例图片缩放比例
    private scale: number = 1;
    // 示例图片在渲染面板中的位置
    private samlpeLeft: number = 0;
    private sampleTop: number = 0;

    // 裁剪框信息
    private cropperStartX = new BehaviorSubject<number>(0);
    private cropperStartY = new BehaviorSubject<number>(0);
    private cropperWidth = new BehaviorSubject<number>(0);
    private cropperHeight = new BehaviorSubject<number>(0);
    private cropperColSpan = new BehaviorSubject<number>(1);

    // 裁剪框在渲染面板中的位置
    private cropperLeft = new BehaviorSubject<number>(0);
    private cropperTop = new BehaviorSubject<number>(0);
    private cropperAreaWidth = new BehaviorSubject<number>(0);
    private cropperAreaHeight = new BehaviorSubject<number>(0);

    // 裁剪器名称
    private cropperName = new BehaviorSubject<string>('');

    // 适用体型
    private bodyType = new BehaviorSubject<BodyType>(BodyType.FEMALE);


    /**
     * Gets the cropper name as an observable.
     *
     * @returns An observable that emits the cropper name.
     *
     */
    public get bodyType$() {
        return this.bodyType.asObservable();
    }

    /**
     * Gets the cropper name as an observable.
     *
     * @returns An observable that emits the cropper name.
     */
    public get cropperName$() {
        return this.cropperName.asObservable();
    }


    /**
     * Gets the sample display URL as an observable.
     *
     * @returns An observable that emits the sample display URL.
     */
    public get sampleDisplayUrl$() {
        return this.sampleDisplayUrl.asObservable();
    }

    /**
     * Gets the cropper start X position as an observable.
     *
     * @returns An observable that emits the cropper start X position.
     */
    public get cropperStartX$() {
        return this.cropperStartX.asObservable();
    }

    /**
     * Gets the cropper start Y position as an observable.
     *
     * @returns An observable that emits the cropper start Y position.
     */
    public get cropperStartY$() {
        return this.cropperStartY.asObservable();
    }

    /**
     * Gets the cropper width as an observable.
     *
     * @returns An observable that emits the cropper width.
     */
    public get cropperWidth$() {
        return this.cropperWidth.asObservable();
    }

    /**
     * Gets the cropper height as an observable.
     *
     * @returns An observable that emits the cropper height.
     */
    public get cropperHeight$() {
        return this.cropperHeight.asObservable();
    }

    /**
     * Gets the cropper column span as an observable.
     *
     * @returns An observable that emits the cropper column span.
     */
    public get cropperColSpan$() {
        return this.cropperColSpan.asObservable();
    }

    /**
     * Gets the cropper left position as an observable.
     *
     * @returns An observable that emits the cropper left position.
     */
    public get cropperLeft$() {
        return this.cropperLeft.asObservable();
    }

    /**
     * Gets the cropper top position as an observable.
     *
     * @returns An observable that emits the cropper top position.
     */
    public get cropperTop$() {
        return this.cropperTop.asObservable();
    }

    public get cropperAreaWidth$() {
        return this.cropperAreaWidth.asObservable();
    }

    public get cropperAreaHeight$() {
        return this.cropperAreaHeight.asObservable();
    }

    /**
     * Sets the body type of the cropper.
     *
     *
     * @param type
     */
    setBodyType(type: BodyType) {
        console.log('setBodyType', type);
        this.bodyType.next(type);
    }

    /**
     * Sets the cropper name.
     *
     * @param name - The name to set for the cropper.
     */
    setCropperName(name: string) {
        this.cropperName.next(name);
    }

    setCropperStartX(x: number) {
        this.cropperStartX.next(x >= 0 ? x : 0);
        this.calcCropperLeft();
    }

    setCropperStartY(y: number) {
        this.cropperStartY.next(y >= 0 ? y : 0);
        this.calcCropperTop();
    }

    setCropperWidth(width: number) {
        this.cropperWidth.next(width >= 0 ? width : 0);
        this.calcCropperAreaWidth();
    }

    setCropperHeight(height: number) {
        this.cropperHeight.next(height > 0 ? height : 0);
        this.calcCropperAreaHeight();
    }

    setCropperColSpan(span: number) {
        let colSpan = span;
        if (colSpan < 1) {
            colSpan = 1;
        }
        this.cropperColSpan.next(colSpan);
    }

    /**
     * Sets the sample image URL and updates the display URL.
     *
     * @param url - The URL of the sample image.
     * @param isLocal - Indicates whether the image is a local file. Defaults to false.
     */
    setSampleUrl(url: string, isLocal: boolean = false) {
        // Set the sample URL property
        this.sampleUrl = url;
        // Set the flag indicating whether the sample is a local file
        this.isLocalSample = isLocal;
        // Initialize the display URL with the provided URL
        let displayUrl = url;
        // If the image is a local file, convert the URL to a displayable format
        if (isLocal) {
            displayUrl = convertFileSrc(url);
        }
        info('setSampleUrl: ' + displayUrl).then(() => {
        });
        // Update the sample display URL observable with the new display URL
        this.sampleDisplayUrl.next(displayUrl);
    }

    setSampleSize(width: number, height: number) {
        this.sampleWidth = width;
        this.sampleHeight = height;
        this.calcSampleScale();
    }

    setRenderPanelSize(width: number, height: number) {
        this.renderPanelWidth = width;
        this.renderPanelHeight = height;
        this.calcSampleScale();
    }

    // 计算示例图片缩放比例和在渲染面板中的位置
    calcSampleScale() {
        // 计算示例图片缩放比例
        const scaleX = this.renderPanelWidth / this.sampleWidth;
        const scaleY = this.renderPanelHeight / this.sampleHeight;
        this.scale = Math.min(1, scaleX, scaleY);
        // 计算示例图片在渲染面板中的位置
        this.samlpeLeft = (this.renderPanelWidth - this.sampleWidth * this.scale) / 2;
        this.sampleTop = (this.renderPanelHeight - this.sampleHeight * this.scale) / 2;
        this.calcCropperLeft();
        this.calcCropperTop();
        this.calcCropperAreaWidth();
        this.calcCropperAreaHeight();
    }

    /**
     * 计算裁剪框在渲染面板中的水平位置
     */
    private calcCropperLeft() {
        const cropperStartX = this.cropperStartX.value;
        const cropperLeft = this.samlpeLeft + cropperStartX * this.scale;
        this.cropperLeft.next(cropperLeft);
    }

    /**
     * 计算裁剪框在渲染面板中的垂直位置
     */
    private calcCropperTop() {
        const cropperStartY = this.cropperStartY.value;
        const cropperTop = this.sampleTop + cropperStartY * this.scale;
        this.cropperTop.next(cropperTop);
    }

    /**
     * 计算裁剪框在渲染面板中的宽度
     */
    private calcCropperAreaWidth() {
        const cropperWidth = this.cropperWidth.value;
        const cropperAreaWidth = cropperWidth * this.scale;
        this.cropperAreaWidth.next(cropperAreaWidth);
    }

    /**
     * 计算裁剪框在渲染面板中的高度
     */

    private calcCropperAreaHeight() {
        const cropperHeight = this.cropperHeight.value;
        const cropperAreaHeight = cropperHeight * this.scale;
        this.cropperAreaHeight.next(cropperAreaHeight);
    }


    destroy() {
        // 本地图片路径，需要销毁创建的预览路径
        if (this.isLocalSample && this.sampleDisplayUrl.value) {
            URL.revokeObjectURL(this.sampleDisplayUrl.value);
        }
    }

    /**
     * 保存裁剪器
     * 如果是本地图片，需要先上传到服务器，然后再保存到数据库中
     */
    async saveCropper() {
        try {
            info('saveCropper invoke');
            this.validateCropper();
            let sampleUrl = await this.uploadLocalSample();
            info(`saving ${sampleUrl}`);
        } catch (error) {
            info(JSON.stringify(error));
        }
    }

    /**
     * 校验裁剪器信息
     * 1. 示例图片不能为空
     */
    private validateCropper() {
        if (!this.sampleUrl) {
            throw new Error('示例图片不能为空');
        }
    }


    private async uploadLocalSample() {
        if (this.isLocalSample) {
            info(`uploading ${this.sampleUrl}`);
            let result = await MinioApi.uploadFiles([this.sampleUrl], 'cropper');
            info(JSON.stringify(result));
            if (result.success) {
                return result.data[0];
            } else {
                throw new Error(result.message);
            }

        } else {
            return this.sampleUrl
        }
    }
}