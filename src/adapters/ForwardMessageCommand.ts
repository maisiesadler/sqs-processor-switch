import { IForwardMessageCommand } from "../interactors/commands";
import { Result } from "../models";

export class ForwardMessageCommand implements IForwardMessageCommand {
    async Execute(queueName: string, message: string): Promise<Result<void, "invalid-permissions">> {
        return {
            success: false,
        }
    }
}
