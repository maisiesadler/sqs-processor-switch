import { IForwardMessageCommand } from "../interactors/commands";
import { Result } from "../models";
import { Lambda } from "aws-sdk";

export class ForwardMessageCommand implements IForwardMessageCommand {
    async Execute(functionName: string, data: any): Promise<Result<void, "invalid-permissions">> {
        try {
            await this.invoke(functionName, data)
            return {
                success: true,
            }
        } catch (err) {
            console.log('Error invoking function', functionName, err)
        }

        return {
            success: false
        }
    }

    private async invoke(functionName: string, payload: any) {
        const lambda = new Lambda();
        return new Promise<void>((resolve, reject) => {
            lambda.invoke({
                FunctionName: functionName,
                InvocationType: 'Event',
                Payload: payload,
            }, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        })
    }
}
