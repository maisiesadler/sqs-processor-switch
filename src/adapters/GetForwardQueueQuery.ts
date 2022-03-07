import config from "../config";
import { IGetForwardQueueQuery } from "../interactors/queries";
import { Result } from "../models";

export class GetForwardQueueQuery implements IGetForwardQueueQuery {
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
