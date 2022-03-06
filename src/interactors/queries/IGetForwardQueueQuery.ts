import { Result } from "../../models";

export type GetForwardQueueQueryError = 'unknown-type'

export interface IGetForwardQueueQuery {
    Execute(messageType: string): Promise<Result<{ lambdaName: string }, GetForwardQueueQueryError>>
}
