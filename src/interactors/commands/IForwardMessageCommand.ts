import { Result } from "../../models";

export type ForwardMessageCommandError = 'invalid-permissions'

export interface IForwardMessageCommand {
    Execute(queueName: string, message: string): Promise<Result<void, ForwardMessageCommandError>>
}
