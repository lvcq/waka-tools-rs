import {CropperPropertyPanel} from "@components/cropper/CropperPropertyPanel"
import {CropperRender} from "@components/cropper/CropperRender"
import {CropperController} from "@controllers/CropperController"
import {makeStyles, tokens} from "@fluentui/react-components"
import {useEffect, useRef} from "react"

const useStyles = makeStyles({
    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden'
    },
    drawer: {
        flex: 1,
        overflow: 'hidden',
    },
    property: {
        width: '300px',
        height: '100%',
        overflow: 'hidden',
        borderLeft: `1px solid ${tokens.colorNeutralStroke2}`
    }
})

export function CropperEditPage() {
    const cropperCtrl = useRef(new CropperController())
    const styles = useStyles()

    useEffect(() => {
        return () => {
            cropperCtrl.current.destroy()
        }
    }, [])

    return (<div className={styles.container}>
        <div className={styles.drawer}>
            <CropperRender controller={cropperCtrl.current}/>
        </div>
        <div className={styles.property}>
            <CropperPropertyPanel controller={cropperCtrl.current}/>
        </div>
    </div>)
}