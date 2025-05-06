export enum BodyType {
    FEMALE = 'female',
    MALE = 'male',
    GIRL = 'girl',
    BOY = 'boy',
    HORSE = 'horse',
}

export interface CropperModel {
    id: string
    name: string
    sample?: string
    start_x: number
    start_y: number
    width: number
    height: number
    col_span: number
    thumbnail: string
    body_type: BodyType
    create_at: number
    update_at: number
}

export interface CropValues {
    x: number
    y: number
    height: number
    width: number
}

export const BodyTypeMap = {
    [BodyType.FEMALE]: '成女',
    [BodyType.MALE]: '成男',
    [BodyType.GIRL]: '萝莉',
    [BodyType.BOY]: '正太',
    [BodyType.HORSE]: '马'
}

export const bodyTypeList = Object.keys(BodyTypeMap).map(key => ({
    value: key,
    label: BodyTypeMap[key as BodyType]
}))
