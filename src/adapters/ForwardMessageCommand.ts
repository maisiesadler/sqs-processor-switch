import { IForwardMessageCommand } from "../interactors/commands";
import { Result } from "../models";

export class ForwardMessageCommand implements IForwardMessageCommand {
    Execute(queueName: string, message: string): Promise<Result<void, "invalid-permissions">> {
        throw new Error("Method not implemented.");
    }
}
