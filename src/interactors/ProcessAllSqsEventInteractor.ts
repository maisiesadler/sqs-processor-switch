import { SQSEvent, SQSRecord } from "aws-lambda";
import { Result } from "../models";
import { IProcessMessageInteractor, Message } from "./ProcessMessageInteractor";

export interface IProcessAllSqsEventInteractor {
    Execute(sqsEvent: SQSEvent): Promise<Result<void, ProcessAllMessagesError>>
}

export type ProcessAllMessagesError = 'ErrorSavingMapped'

export class ProcessAllSqsEventInteractor implements IProcessAllSqsEventInteractor {
    constructor(
        private readonly processMessageInteractor: IProcessMessageInteractor) { }

    public async Execute(sqsEvent: SQSEvent): Promise<Result<void, ProcessAllMessagesError>> {

        for (let record of sqsEvent.Records) {
            const messageResult = this.recordAsMessage(record)
            if (messageResult.success)
                await this.processMessageInteractor.Execute(messageResult.data)
        }

        return {
            success: true,
        }
    }

    private recordAsMessage(sqsRecord: SQSRecord): Result<Message, void> {
        const data = JSON.parse(sqsRecord.body)

        return {
            success: true,
            data: {
                Type: data.Type,
                Data: data.Data,
            }
        }
    }
}
