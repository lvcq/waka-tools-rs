import {makeStyles, tokens} from "@fluentui/react-components"
import {ReactNode} from "react"

interface NormalPageProps {
    children?: ReactNode
}

const useStyles = makeStyles({
    root: {
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        boxSizing: 'border-box',
        paddingInline: tokens.spacingHorizontalL,
        paddingBlock: tokens.spacingVerticalL
    }
})

export function NormalPage({children}: NormalPageProps) {
    const styles = useStyles()
    return (
        <div className={styles.root}>
            {children}
        </div>
    )
}