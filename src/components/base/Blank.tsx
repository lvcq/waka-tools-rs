import { makeStyles } from "@fluentui/react-components"
import { useEffect, useState } from "react"

interface BlankProps {
    width?: string,
    height?: string,
    spacer?: boolean
}

const useStyles = makeStyles({
    root: {
        visibility: 'hidden',
        pointerEvents: 'none'
    }
})


export function Blank({ width, height, spacer = false }: BlankProps) {
    const styles = useStyles()
    const [spaceStyle, setSpaceStyle] = useState<React.CSSProperties>({})
    useEffect(() => {
        let newStyle: React.CSSProperties = {
            width: width ?? 0,
            height: height ?? 0
        }
        if (spacer) {
            newStyle.flex = '1'
        }
        setSpaceStyle(newStyle)
    }, [width, height, spacer])
    return (
        <div className={styles.root} style={spaceStyle}>
        </div>
    )
}