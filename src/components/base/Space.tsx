import { makeStyles } from "@fluentui/react-components"

interface SpaceProps {
    direction?: 'column' | 'row'
    align?: 'start' | 'center' | 'end' | 'stretch'
    space?: number
    children?: React.ReactNode
}

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexWrap: 'wrap'
    }
})

export function Space({ children, space = 8, direction = 'row', align = 'start' }: SpaceProps) {
    const styles = useStyles()
    return (
        <div className={styles.root} style={{ flexDirection: direction, gap: `${space}px`, justifyContent: align }} >
            {children}
        </div>
    )
}