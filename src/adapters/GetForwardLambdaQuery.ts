import config from "../config";
import { IGetForwardLambdaQuery } from "../interactors/queries";
import { Result } from "../models";

export class GetForwardLambdaQuery implements IGetForwardLambdaQuery {
    async Execute(messageType: string): Promise<Result<{ lambdaName: string; }, "unknown-type">> {

        console.log('processing message type', messageType)

        if (messageType === 'SlackNotification') {
            return {
                success: true,
                data: {
                    lambdaName: config.slackLambdaName,
                }
            }
        }

        return {
            success: false,
            error: 'unknown-type',
        }
    }
}
