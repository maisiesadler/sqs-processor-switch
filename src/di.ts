import { Result } from "./models";
import { IRecordErrorCommand } from "./interactors/commands";
import { ForwardMessageCommand, GetForwardQueueQuery, RecordErrorLogCommand } from "./adapters";
import {
    IProcessAllSqsEventInteractor,
    ProcessAllMessagesError,
    ProcessAllSqsEventInteractor,
} from "./interactors/ProcessAllSqsEventInteractor";
import { IProcessMessageInteractor, ProcessMessageInteractor } from "./interactors/ProcessMessageInteractor";
import { IForwardMessageCommand } from "./interactors/commands";
import { IGetForwardQueueQuery } from "./interactors/queries";
import { SQSEvent } from "aws-lambda";


class Implementations {

    ForwardMessageCommand() : IForwardMessageCommand {
        return new ForwardMessageCommand()
    }

    GetForwardQueueQuery() : IGetForwardQueueQuery {
        return new GetForwardQueueQuery()
    }

    RecordErrorCommand() : IRecordErrorCommand {
        return new RecordErrorLogCommand()
    }

    ProcessMessageInteractor(): IProcessMessageInteractor {
        return new ProcessMessageInteractor(
            this.GetForwardQueueQuery(),
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
