import { IRecordErrorCommand, RecordedError } from "../interactors/commands";
import { Result } from "../models";

export class RecordErrorLogCommand implements IRecordErrorCommand {
    async Execute(recordedError: RecordedError): Promise<Result<void, void>> {
        console.log('Found error', recordedError)
        return { success: true }
    }
}
