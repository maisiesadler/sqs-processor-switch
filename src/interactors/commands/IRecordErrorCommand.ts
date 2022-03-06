import { Result } from "../../models";

export type RecordedError = 'error-processing' | 'error-converting' | 'invalid-json' | 'missing-fields' | 'unknown-type'

export interface IRecordErrorCommand {
    Execute(recordedError: RecordedError): Promise<Result<void, void>>
}
