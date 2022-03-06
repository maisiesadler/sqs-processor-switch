export interface Result<TValue, TError> {
    success: boolean;
    data?: TValue;
    error?: TError
}
