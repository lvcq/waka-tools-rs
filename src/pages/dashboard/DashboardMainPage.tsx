import { makeStyles, tokens } from "@fluentui/react-components"
import { SideNav } from "./SideNav"
import { Outlet } from "react-router"

const useStyles = makeStyles({
    root: {
        display: 'flex',
        height: '100%'
    },
    content: {
        flexGrow: 1,
        background: tokens.colorNeutralBackground2,
        overflow: 'hidden'
    }
})

export function DashboardMainPage() {
    const styles = useStyles()
    return (
        <div className={styles.root}>
            <SideNav/>
            <div className={styles.content}>
                <Outlet/>
            </div>
        </div>
    )
}