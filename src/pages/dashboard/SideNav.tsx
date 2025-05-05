import { Button, Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerHeaderTitle, makeStyles, MenuItem, MenuList, tokens } from "@fluentui/react-components";
import { useState } from "react";
import { ArrowLeftRegular,ArrowRightRegular ,CropRegular,SettingsRegular } from "@fluentui/react-icons"
import { useNavigate } from "react-router";
import { RouterPath } from "../../models/RouterModel";

const useStyles = makeStyles({
    root: {
        display: 'flex',
        height: '100%'
    },
    drawer: {
        transition: 'width 0.3s ease'
    },
    drawerHeaderRail: {
        paddingLeft: tokens.spacingHorizontalM
    },

    sideMenuItem: {
        wordBreak: 'break-all',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'clip'
    },
    footerMenus: {
        width: '100%'
    }

})

export function SideNav() {
    const styles = useStyles()
    const [isOpen, setIsOpen] = useState(true)
    const navigate = useNavigate()
    const toggleDrawer = () => {
        setIsOpen(!isOpen)
    }

    const handleNavMenuClick = (path: RouterPath) => {
        navigate(path)
    }

    return (
        <Drawer
            open
            type="inline"
            className={styles.drawer}
            style={{ width: isOpen ? '256px' : '84px' }}
        >
            <DrawerHeader
                className={styles.drawerHeaderRail}>
                <DrawerHeaderTitle
                    action={
                        <Button
                            appearance="transparent"
                            icon={isOpen ? <ArrowLeftRegular /> : <ArrowRightRegular />}
                            onClick={toggleDrawer}></Button>
                    }></DrawerHeaderTitle>
            </DrawerHeader>
            <DrawerBody>
                <MenuList>
                    <MenuItem className={styles.sideMenuItem} icon={<CropRegular />} onClick={() => {
                        handleNavMenuClick(RouterPath.CROPPER_LIST)
                    }}>   {isOpen ? '裁剪器' : ''}</MenuItem>
                </MenuList>
            </DrawerBody>
            <DrawerFooter>
                <MenuList className={styles.footerMenus}>
                    <MenuItem className={styles.sideMenuItem} icon={<SettingsRegular />} onClick={() => {
                        handleNavMenuClick(RouterPath.SETTINGS)
                    }}>{isOpen ? '设置' : ''}</MenuItem>
                </MenuList>
            </DrawerFooter>
        </Drawer>
    )

}