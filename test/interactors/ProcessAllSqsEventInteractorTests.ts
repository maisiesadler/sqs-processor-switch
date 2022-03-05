import { expect } from 'chai';
import * as sinon from 'sinon';
import 'mocha';
import { SQSEvent, SQSRecord } from 'aws-lambda';
import { Result } from '../../src/models';
import {
    ProcessAllSqsEventInteractor,
} from '../../src/interactors/ProcessAllSqsEventInteractor';
import { IProcessMessageInteractor, ProcessMessageError } from '../../src/interactors/ProcessMessageInteractor';

const CompletedPromise = <T>(value: T) => new Promise<T>((resolve, reject) => {
    resolve(value)
})

function asValidSqsRecord(type: string, o: any): SQSRecord {
    return {
        body: JSON.stringify({
            Type: type, Data: o,
        })
    } as SQSRecord
}

function asSqsEvent(records: SQSRecord[]): SQSEvent {
    return { Records: records }
}

function createProcessAllSqsEventInteractor(overrides?: {
    processMessageResult?: Result<void, ProcessMessageError>
}) {

    const processMessageInteractor: IProcessMessageInteractor = {
        Execute: () => CompletedPromise(overrides?.processMessageResult || {
            success: true,
        })
    }
    const processMessageInteractorSpy = sinon.spy(processMessageInteractor, 'Execute');

    return {
        interactor: new ProcessAllSqsEventInteractor(
            processMessageInteractor
        ),
        processMessageInteractorSpy,
    }
}

describe('ProcessAllSqsEventInteractor', function () {
    it('Messages empty, returns true', async () => {

        // Arrange
        const { interactor } = createProcessAllSqsEventInteractor()

        // Act
        const response = await interactor.Execute(asSqsEvent([]))

        // Assert
        expect(response.success).to.equal(true);
        expect(response.error).to.equal(undefined);
    })

    it('SQS Records sent to processor as Message', async () => {

        // Arrange
        const { interactor, processMessageInteractorSpy } = createProcessAllSqsEventInteractor()

        const data1 = { one: 1 }
        const data2 = { two: 2 }

        // Act
        const response = await interactor.Execute(asSqsEvent([
            asValidSqsRecord('type', data1),
            asValidSqsRecord('type', data2),
        ]))

        // Assert
        expect(response.success).to.equal(true);
        expect(response.error).to.equal(undefined);
        sinon.assert.callCount(processMessageInteractorSpy, 2);
        sinon.assert.calledWithExactly(processMessageInteractorSpy.getCall(0),
            sinon.match({
                Type: 'type', Data: data1
            }));
        sinon.assert.calledWithExactly(processMessageInteractorSpy.getCall(1),
            sinon.match({
                Type: 'type', Data: data2
            }));
    })
});
