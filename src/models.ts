import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from "aws-lambda";

export interface Result<TValue, TError> {
    success: boolean;
    data?: TValue;
    error?: TError
}
