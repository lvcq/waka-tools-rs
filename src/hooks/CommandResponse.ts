export interface CommandResponse<T> {
    success: boolean
    message?: string
    data: T
}