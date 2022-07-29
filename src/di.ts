import { Result } from "./models";
import { IRecordErrorCommand } from "./interactors/commands";
import { ForwardMessageCommand, GetForwardLambdaQuery, RecordErrorLogCommand } from "./adapters";
import {
    IProcessAllSqsEventInteractor,
    ProcessAllMessagesError,
    ProcessAllSqsEventInteractor,
} from "./interactors/ProcessAllSqsEventInteractor";
import { IProcessMessageInteractor, ProcessMessageInteractor } from "./interactors/ProcessMessageInteractor";
import { IForwardMessageCommand } from "./interactors/commands";
import { IGetForwardLambdaQuery } from "./interactors/queries";
import { SQSEvent } from "aws-lambda";


class Implementations {

    ForwardMessageCommand() : IForwardMessageCommand {
        return new ForwardMessageCommand()
    }

    GetForwardLambdaQuery() : IGetForwardLambdaQuery {
        return new GetForwardLambdaQuery()
    }

    RecordErrorCommand() : IRecordErrorCommand {
        return new RecordErrorLogCommand()
    }

    ProcessMessageInteractor(): IProcessMessageInteractor {
        return new ProcessMessageInteractor(
            this.GetForwardLambdaQuery(),
            this.ForwardMessageCommand()
        )
    }

    ProcessAllSqsEventInteractor(): IProcessAllSqsEventInteractor {
        return new ProcessAllSqsEventInteractor(
            this.RecordErrorCommand(),
            this.ProcessMessageInteractor()
        )
    }
}

const implementations = new Implementations()
export const ProcessAllSqsEvents: (sqsEvent: SQSEvent) => Promise<Result<void, ProcessAllMessagesError>>
    = (sqsEvent: SQSEvent) => {
    return implementations.ProcessAllSqsEventInteractor().Execute(sqsEvent)
}
