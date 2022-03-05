import { expect } from 'chai';
import * as sinon from 'sinon';
import 'mocha';
import { Result } from '../../src/models';
import {
    ForwardMessageCommandError,
    GetForwardQueueQueryError,
    IForwardMessageCommand,
    IGetForwardQueueQuery,
    ProcessMessageInteractor,
} from '../../src/interactors/ProcessMessageInteractor';

const CompletedPromise = <T>(value: T) => new Promise<T>((resolve, reject) => {
    resolve(value)
})

function createProcessAllMessagesInteractor(
    overrides?: {
        getForwardQueueResult?: Result<{ lambdaName: string }, GetForwardQueueQueryError>,
        forwardMessageResult?: Result<void, ForwardMessageCommandError>,
    }) {

    const getForwardQueueQuery: IGetForwardQueueQuery = {
        Execute: () => CompletedPromise(overrides?.getForwardQueueResult || {
            success: false,
        })
    }
    const getForwardQueueQuerySpy = sinon.spy(getForwardQueueQuery, 'Execute');

    const forwardMessageCommand: IForwardMessageCommand = {
        Execute: () => CompletedPromise(overrides?.forwardMessageResult || {
            success: false,
        })
    }
    const forwardMessageCommandSpy = sinon.spy(forwardMessageCommand, 'Execute');

    return {
        interactor: new ProcessMessageInteractor(
            getForwardQueueQuery,
            forwardMessageCommand
        ),
        getForwardQueueQuerySpy,
        forwardMessageCommandSpy,
    }
}

describe('ProcessMessageInteractor', function () {
    it('Type known, return success', async () => {

        // Arrange
        const { interactor } = createProcessAllMessagesInteractor({
            getForwardQueueResult: { success: true, data: { lambdaName: 'forward-lambda-name' } }
        })

        // Act
        const response = await interactor.Execute({
            Type: 'pizza',
            Data: {},
        })

        // Assert
        expect(response.success).to.equal(true);
        expect(response.error).to.equal(undefined);
    })

    it('Type unknown, return failure', async () => {

        // Arrange
        const { interactor } = createProcessAllMessagesInteractor({
            getForwardQueueResult: { success: false, }
        })

        // Act
        const response = await interactor.Execute({
            Type: 'some-unknown-thing',
            Data: {},
        })

        // Assert
        expect(response.success).to.equal(false);
        expect(response.error).to.equal('unknown-type');
    })
});
