import {
    Button,
    Combobox,
    Divider,
    Field,
    Input,
    makeStyles,
    Subtitle2,
    Option,
    ComboboxProps,
    tokens
} from "@fluentui/react-components"
import {ArrowUploadRegular} from "@fluentui/react-icons"
import {CropperController} from "@controllers/CropperController"
import {useWakaThrottle} from "@hooks/wakaThrottle"
import {FileSelectHelper} from "@helpers/FileSelectHelper"
import {Blank} from "@components/base/Blank"
import {useEffect, useState} from "react"
import {BodyType, bodyTypeList} from "@models/CropperModel"


interface CropperPropertyPanelProps {
    controller: CropperController
}

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        padding: '20px',
        overflow: 'hidden'
    },
    content: {
        flex: 1,
        overflowY: 'auto'
    },
    actionArea: {
        display: 'flex',
        flexDirection: 'row',
        gap: '12px',
        paddingTop: tokens.spacingVerticalM
    },
    selectSample: {
        textAlign: 'center'
    }
})


export function CropperPropertyPanel({controller}: CropperPropertyPanelProps) {
    const styles = useStyles()
    const [startX, setStartX] = useState<number>(0)
    const [startY, setStartY] = useState<number>(0)
    const [width, setWidth] = useState<number>(0)
    const [height, setHeight] = useState<number>(0)
    const [colSpan, setColSpan] = useState<number>(0)
    const [cropperName, setCropperName] = useState<string>('')
    const [bodyType, setBodyType] = useState<string>('')

    useEffect(() => {
        let startXSub = controller.cropperStartX$.subscribe(setStartX)
        let startYSub = controller.cropperStartY$.subscribe(setStartY)
        let widthSub = controller.cropperWidth$.subscribe(setWidth)
        let heightSub = controller.cropperHeight$.subscribe(setHeight)
        let colSpanSub = controller.cropperColSpan$.subscribe(setColSpan)
        let cropperNameSub = controller.cropperName$.subscribe(setCropperName)
        let bodyTypeSub = controller.bodyType$.subscribe((value) => {
            let item = bodyTypeList.find((item) => item.value === value)
            if (item) {
                setBodyType(item.label)
            }
        })
        return () => {
            startXSub.unsubscribe()
            startYSub.unsubscribe()
            widthSub.unsubscribe()
            heightSub.unsubscribe()
            colSpanSub.unsubscribe()
            cropperNameSub.unsubscribe()
            bodyTypeSub.unsubscribe()
        }
    }, [])

    const handleSelectSample = useWakaThrottle(async () => {
        let sample = await FileSelectHelper.selectPicture()
        if (sample && sample.length > 0) {

            controller.setSampleUrl(sample[0], true)
        }
    })

    const handleBodyTypeSelect: ComboboxProps['onOptionSelect'] = (_event, data) => {
        if (data.selectedOptions.length === 0) {
            return
        }
        controller.setBodyType(data.selectedOptions[0] as BodyType)
    }

    return (<div className={styles.container}>
        <div className={styles.content}>
            <div className={styles.selectSample}>
                <Button appearance="primary" icon={<ArrowUploadRegular/>}
                        onClick={handleSelectSample}>选择示例图片</Button>
            </div>
            <Blank height="8px"/>
            <Divider/>
            <Blank height="8px"/>
            <Subtitle2 block>裁剪信息</Subtitle2>
            <Field label="横轴起点">
                <Input type="number" value={String(startX)}
                       onChange={(event) => controller.setCropperStartX(Number(event.target.value))}/>
            </Field>
            <Field label="纵轴起点">
                <Input type="number" value={String(startY)}
                       onChange={(event) => controller.setCropperStartY(Number(event.target.value))}/>
            </Field>
            <Field label="裁剪宽度">
                <Input type="number" value={String(width)}
                       onChange={(event) => controller.setCropperWidth(Number(event.target.value))}/>
            </Field>
            <Field label="裁剪高度">
                <Input type="number" value={String(height)}
                       onChange={(event) => controller.setCropperHeight(Number(event.target.value))}/>
            </Field>
            <Field label="占用列">
                <Input type="number" value={String(colSpan)}
                       onChange={(event) => controller.setCropperColSpan(Number(event.target.value))}/>
            </Field>
            <Blank height="8px"/>
            <Divider/>
            <Blank height="8px"/>
            <Subtitle2 block>基础信息</Subtitle2>
            <Field label="裁剪器名称">
                <Input
                    type="text"
                    value={cropperName} onChange={(event) => controller.setCropperName(event.target.value)}
                    maxLength={32}
                    placeholder="请输入"/>
            </Field>
            <Field label="适用体型">
                <Combobox placeholder="请选择" value={bodyType} onOptionSelect={handleBodyTypeSelect}>
                    {bodyTypeList.map((item) => (
                        <Option key={item.value} value={item.value} text={item.label}>{item.label}</Option>
                    ))}
                </Combobox>
            </Field>
        </div>
        <div className={styles.actionArea}>
            <Button appearance="primary" onClick={() => controller.saveCropper()}>保存</Button>
        </div>
    </div>)
}