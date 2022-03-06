import { IGetForwardQueueQuery } from "../interactors/queries";
import { Result } from "../models";

export class GetForwardQueueQuery implements IGetForwardQueueQuery {
    Execute(messageType: string): Promise<Result<{ lambdaName: string; }, "unknown-type">> {
        throw new Error("Method not implemented.");
    }
}
