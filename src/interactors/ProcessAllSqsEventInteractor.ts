import { SQSEvent, SQSRecord } from "aws-lambda";
import { Result } from "../models";
import { IProcessMessageInteractor, Message } from "./ProcessMessageInteractor";

export type RecordedError = 'invalid-json'

export interface IRecordErrorCommand {
    Execute(recordedError: RecordedError): Promise<Result<void, void>>
}

export interface IProcessAllSqsEventInteractor {
    Execute(sqsEvent: SQSEvent): Promise<Result<void, ProcessAllMessagesError>>
}

export type ProcessAllMessagesError = 'ErrorSavingMapped'

export class ProcessAllSqsEventInteractor implements IProcessAllSqsEventInteractor {
    constructor(
        private readonly recordErrorCommand: IRecordErrorCommand,
        private readonly processMessageInteractor: IProcessMessageInteractor) { }

    public async Execute(sqsEvent: SQSEvent): Promise<Result<void, ProcessAllMessagesError>> {

        for (let record of sqsEvent.Records) {
            const messageResult = this.recordAsMessage(record)
            if (messageResult.success) {

                await this.processMessageInteractor.Execute(messageResult.data)
            } else {
                await this.recordErrorCommand.Execute('invalid-json')
            }
        }

        return {
            success: true,
        }
    }

    private recordAsMessage(sqsRecord: SQSRecord): Result<Message, 'invalid-json'> {
        try {
            const data = JSON.parse(sqsRecord.body)

            return {
                success: true,
                data: {
                    Type: data.Type,
                    Data: data.Data,
                }
            }
        } catch (e) {
            return {
                success: false,
            }
        }
    }
}
