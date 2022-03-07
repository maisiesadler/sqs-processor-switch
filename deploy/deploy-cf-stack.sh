#!/bin/bash

set -e

if [[ -z "${SLACK_LAMBDA_NAME}" ]]; then
  echo Missing SLACK_LAMBDA_NAME
  exit 1
fi

templateFile='./deploy/template.yml'

aws cloudformation deploy \
    --stack-name sqs-processor-lambda-pipeline \
    --template-file $templateFile \
    --capabilities CAPABILITY_IAM \
    --no-fail-on-empty-changeset \
        SlackLambdaName=$SLACK_LAMBDA_NAME

processorResource=$(aws cloudformation describe-stack-resource \
  --stack-name sqs-processor-lambda-pipeline \
  --logical-resource-id SqsProcessorLambda)

physicalprocessorResource=$(echo $processorResource | jq -r '.StackResourceDetail.PhysicalResourceId')

echo "::set-output name=processor_lambda_function_name::$physicalprocessorResource"
