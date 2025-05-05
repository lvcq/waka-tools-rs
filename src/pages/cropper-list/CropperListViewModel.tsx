import {useDebounce} from "@uidotdev/usehooks";
import {useEffect, useState} from "react";


export function useCropperListViewModel() {

    const [searchText, setSearchText] = useState<string>('')
    const debounceSearchText = useDebounce(searchText, 500)

    useEffect(() => {
        applySearch(debounceSearchText)
    }, [debounceSearchText])

    /**
     * 从数据库查询裁剪器列表
     */


    function applySearch(filterText: string) {
        console.log(filterText)
    }

    return {
        searchText, setSearchText
    }

}