import { SQSEvent } from "aws-lambda";
import { ProcessAllSqsEvents } from "./di";

export const handler = async (
    event: SQSEvent
): Promise<{ statusCode: number }> => {

    const result = await ProcessAllSqsEvents(event)

    console.log('success', event.Records.length)

    return {
        statusCode: 200,
    }
};
