import { NormalPage } from "@components/pageLayouts/NormalPage";
import { Button, Field, makeStyles, SearchBox } from "@fluentui/react-components";
import { useCropperListViewModel } from "./CropperListViewModel";
import { Space } from "@components/base/Space";
import { AddRegular } from "@fluentui/react-icons";
import { useWakaThrottle } from "@hooks/wakaThrottle";
import {useNavigate} from "react-router"
import { RouterPath } from "@models/RouterModel";

const useStyles = makeStyles({
    filterBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

})
export function CropperListPage() {
    const styles = useStyles();
    const viewModel = useCropperListViewModel()
    const navigate = useNavigate()
    const handleNewClick = useWakaThrottle(() => {
        navigate(RouterPath.CROPPER_EDIT)
    })
    return (
        <NormalPage>
            <div className={styles.filterBar}>
                <Field
                    label="名称或者体型搜索"
                >
                    <SearchBox
                        aria-label="Search"
                        appearance="underline"
                        value={viewModel.searchText}
                        onChange={(_evt, data) => viewModel.setSearchText(data.value)}
                    />
                </Field>
                <Space>
                    <Button appearance="primary" icon={<AddRegular />} onClick={handleNewClick}>新增</Button>
                </Space>
            </div>
        </NormalPage>
    )
}