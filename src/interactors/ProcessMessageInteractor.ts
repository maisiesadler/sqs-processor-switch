import { Result } from "../models";

export interface QueueConfiguration {
    switches: { [key: string]: string } // message type to sqs queue
}

export interface Message {
    Type: string,
    Data: any
}

export type ForwardMessageCommandError = 'invalid-permissions'

export interface IForwardMessageCommand {
    Execute(queueName: string, message: string): Promise<Result<void, ForwardMessageCommandError>>
}

export type GetForwardQueueQueryError = 'unknown-type'

export interface IGetForwardQueueQuery {
    Execute(messageType: string): Promise<Result<{ lambdaName: string }, GetForwardQueueQueryError>>
}

export interface IProcessMessageInteractor {
    Execute(messages: Message): Promise<Result<void, ProcessMessageError>>
}

export type ProcessMessageError = 'unknown-type'

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
