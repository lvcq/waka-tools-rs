import {Button, makeStyles, tokens, typographyStyles} from "@fluentui/react-components"
import {Blank} from "./base/Blank";
import {Space} from "./base/Space";
import {MaximizeRegular, SquareMultipleRegular, SubtractRegular, DismissRegular} from "@fluentui/react-icons";
import {getCurrentWindow} from '@tauri-apps/api/window'
import {useEffect, useState} from "react";


const useStyles = makeStyles({
    appBar: {
        height: '48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
        paddingInline: tokens.spacingHorizontalM,
    },
    appTitle: typographyStyles.subtitle2Stronger
})

export function AppBar() {
    const styles = useStyles();
    const [isMaximized, setIsMaximized] = useState(false);
    useEffect(() => {
        function handleResize() {
            getCurrentWindow().isMaximized().then((newState) => setIsMaximized(newState));
        }

        handleResize();

        const unlisten = getCurrentWindow().listen('tauri://resize', async () => {
            handleResize();
        });
        return () => {
            unlisten.then((u) => u());
        };
    }, [])

    function handleMinimizeClick() {
        getCurrentWindow().minimize().then(() => {
        });
    }

    function handleMaximizeClick() {
        getCurrentWindow().toggleMaximize().then(() => {
        });
    }

    function handleCloseClick() {
        getCurrentWindow().close().then(() => {
        });
    }

    return (
        <div data-tauri-drag-region className={styles.appBar}>
            <span className={styles.appTitle}>哇卡-剑网三工具</span>
            <Blank spacer></Blank>
            <Space space={16}>
                <Button size="small" appearance="subtle" icon={<SubtractRegular/>}
                        onClick={handleMinimizeClick}></Button>
                <Button size="small" appearance="subtle"
                        icon={isMaximized ? < SquareMultipleRegular/> : <MaximizeRegular/>}
                        onClick={handleMaximizeClick}></Button>
                <Button size="small" appearance="subtle" icon={<DismissRegular/>} onClick={handleCloseClick}></Button>
            </Space>
        </div>
    )
}