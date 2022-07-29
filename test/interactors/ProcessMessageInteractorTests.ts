import { expect } from 'chai';
import * as sinon from 'sinon';
import 'mocha';
import { Result } from '../../src/models';
import { ProcessMessageInteractor } from '../../src/interactors/ProcessMessageInteractor';
import { GetForwardLambdaQueryError, IGetForwardLambdaQuery } from '../../src/interactors/queries';
import { ForwardMessageCommandError, IForwardMessageCommand } from '../../src/interactors/commands';

const CompletedPromise = <T>(value: T) => new Promise<T>((resolve, reject) => {
    resolve(value)
})

function createProcessAllMessagesInteractor(
    overrides?: {
        getForwardLambdaResult?: Result<{ lambdaName: string }, GetForwardLambdaQueryError>,
        forwardMessageResult?: Result<void, ForwardMessageCommandError>,
    }) {

    const getForwardLambdaQuery: IGetForwardLambdaQuery = {
        Execute: () => CompletedPromise(overrides?.getForwardLambdaResult || {
            success: false,
        })
    }
    const getForwardLambdaQuerySpy = sinon.spy(getForwardLambdaQuery, 'Execute');

    const forwardMessageCommand: IForwardMessageCommand = {
        Execute: () => CompletedPromise(overrides?.forwardMessageResult || {
            success: false,
        })
    }
    const forwardMessageCommandSpy = sinon.spy(forwardMessageCommand, 'Execute');

    return {
        interactor: new ProcessMessageInteractor(
            getForwardLambdaQuery,
            forwardMessageCommand
        ),
        getForwardLambdaQuerySpy,
        forwardMessageCommandSpy,
    }
}

describe('ProcessMessageInteractor', function () {
    it('Type known, return success', async () => {

        // Arrange
        const { interactor } = createProcessAllMessagesInteractor({
            getForwardLambdaResult: { success: true, data: { lambdaName: 'forward-lambda-name' } }
        })

        // Act
        const response = await interactor.Execute({
            Type: 'pizza',
            Data: '{}',
        })

        // Assert
        expect(response.success).to.equal(true);
        expect(response.error).to.equal(undefined);
    })

    it('Type unknown, return failure', async () => {

        // Arrange
        const { interactor } = createProcessAllMessagesInteractor({
            getForwardLambdaResult: { success: false, }
        })

        // Act
        const response = await interactor.Execute({
            Type: 'some-unknown-thing',
            Data: '{}',
        })

        // Assert
        expect(response.success).to.equal(false);
        expect(response.error).to.equal('unknown-type');
    })
});
