import { Result } from "../../models";

export type GetForwardLambdaQueryError = 'unknown-type'

export interface IGetForwardLambdaQuery {
    Execute(messageType: string): Promise<Result<{ lambdaName: string }, GetForwardLambdaQueryError>>
}
