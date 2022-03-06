import { Result } from "../models";
import { IForwardMessageCommand } from "./commands";
import { IGetForwardQueueQuery } from "./queries";

export interface QueueConfiguration {
    switches: { [key: string]: string } // message type to sqs queue
}

export interface Message {
    Type: string,
    Data: any
}

export type ProcessMessageError = 'unknown-type'

export interface IProcessMessageInteractor {
    Execute(messages: Message): Promise<Result<void, ProcessMessageError>>
}

export class ProcessMessageInteractor implements IProcessMessageInteractor {
    constructor(
        private readonly getForwardQueueQuery: IGetForwardQueueQuery,
        private readonly forwardMessageCommand: IForwardMessageCommand) { }

    public async Execute(message: Message): Promise<Result<void, ProcessMessageError>> {

        const getQueueResult = await this.getForwardQueueQuery.Execute(message.Type)

        if (!getQueueResult.success) {
            return {
                success: false,
                error: 'unknown-type',
            }
        }

        await this.forwardMessageCommand.Execute(getQueueResult.data.lambdaName, message.Data)

        return {
            success: true,
        }
    }
}
