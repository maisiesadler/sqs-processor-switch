import { Result } from "../../models";

export type ForwardMessageCommandError = 'invalid-permissions'

export interface IForwardMessageCommand {
    Execute(functionName: string, message: string): Promise<Result<void, ForwardMessageCommandError>>
}
