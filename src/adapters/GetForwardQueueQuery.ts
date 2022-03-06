import { IGetForwardQueueQuery } from "../interactors/queries";
import { Result } from "../models";

export class GetForwardQueueQuery implements IGetForwardQueueQuery {
    async Execute(messageType: string): Promise<Result<{ lambdaName: string; }, "unknown-type">> {
        return {
            success: false,
            error: 'unknown-type',
        }
    }
}
