import {CropperController} from "@controllers/CropperController"
import {makeStyles, tokens} from "@fluentui/react-components"
import {useChessboardStyle} from "@hooks/useChessboardStyle"
import {useEffect, useRef, useState} from "react"
import classnames from "classnames"
import {useMeasure} from "@uidotdev/usehooks"

interface CropperRenderProps {
    controller: CropperController
}

const useStyles = makeStyles({
    container: {
        position: 'relative',
        width: '100%',
        height: '100%',
    },
    sampleImg: {
        width: '100%',
        height: '100%',
        objectFit: 'scale-down'
    },
    sampleImgInfo: {
        position: 'absolute',
        right: 0,
        top: 0,
        background: tokens.colorNeutralBackgroundAlpha2,
        padding: tokens.spacingHorizontalXL,
    },
    leftBaseLine: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '1px',
        height: '100%',
        backgroundColor: tokens.colorBrandBackground
    },
    topBaseLine: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        width: '100%',
        height: '1px',
        backgroundColor: tokens.colorBrandBackground
    },
    cropperBox: {
        position: 'absolute',
        backgroundColor: tokens.colorPaletteRedBackground3,
        opacity: 0.65,
    },
    middleLine: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: '1px',
        height: '100%',
        backgroundColor: tokens.colorStatusSuccessBorder1
    }
})

export function CropperRender({controller}: CropperRenderProps) {
    const styles = useStyles()
    const chessboardStyle = useChessboardStyle()
    const [sampleUrl, setSampleUrl] = useState<string>('')
    const sampleNode = useRef<HTMLImageElement>(null)
    const [ref, {width, height}] = useMeasure()
    const [cropperLeft, setCropperLeft] = useState<number>(0)
    const [cropperTop, setCropperTop] = useState<number>(0)
    const [cropperWidth, setCropperWidth] = useState<number>(0)
    const [cropperHeight, setCropperHeight] = useState<number>(0)
    const [sampleImgNaturalWidth, setSampleImgNaturalWidth] = useState<number>(0)
    const [sampleImgNaturalHeight, setSampleImgNaturalHeight] = useState<number>(0)

    useEffect(() => {
        const sampleUrlSub = controller.sampleDisplayUrl$.subscribe(setSampleUrl)
        const cropperLeftSub = controller.cropperLeft$.subscribe(setCropperLeft)
        const cropperTopSub = controller.cropperTop$.subscribe(setCropperTop)
        const cropperWidthSub = controller.cropperAreaWidth$.subscribe(setCropperWidth)
        const cropperHeightSub = controller.cropperAreaHeight$.subscribe(setCropperHeight)
        return () => {
            sampleUrlSub.unsubscribe()
            cropperLeftSub.unsubscribe()
            cropperTopSub.unsubscribe()
            cropperWidthSub.unsubscribe()
            cropperHeightSub.unsubscribe()
        }
    }, [])

    useEffect(() => {
        controller.setRenderPanelSize(width ?? 0, height ?? 0)
    }, [width, height])

    function handleSampleImgLoad() {
        if (!sampleNode.current) {
            return
        }
        let img = sampleNode.current
        let width = img.naturalWidth
        let height = img.naturalHeight
        setSampleImgNaturalWidth(width)
        setSampleImgNaturalHeight(height)
        controller.setSampleSize(width, height)
    }

    return (
        <div ref={ref} className={classnames(styles.container, chessboardStyle.chessboard)}>
            {sampleUrl ? <img alt="" ref={sampleNode} className={styles.sampleImg} src={sampleUrl}
                              onLoad={handleSampleImgLoad}/> : null}

            <div className={styles.sampleImgInfo}>
                图片尺寸：{sampleImgNaturalWidth ?? 0} x {sampleImgNaturalHeight ?? 0}
            </div>

            {/** 左侧基准线 */}
            <div className={styles.leftBaseLine} style={{left: cropperLeft + 'px'}}></div>
            {/** 顶部基准线 */}
            <div className={styles.topBaseLine} style={{top: cropperTop + 'px'}}></div>
            {/** 中间线 */}
            {cropperWidth > 0 &&
                <div className={styles.middleLine} style={{left: cropperLeft + cropperWidth / 2 + 'px'}}></div>}

            {/** 裁剪框 */}
            <div className={styles.cropperBox} style={{
                top: cropperTop + 'px',
                left: cropperLeft + 'px',
                width: cropperWidth + 'px',
                height: cropperHeight + 'px',
            }}></div>


        </div>
    )
}