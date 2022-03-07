#!/bin/bash

set -e

templateFile='./deploy/template.yml'

aws cloudformation deploy \
    --stack-name sqs-processor-lambda-pipeline \
    --template-file $templateFile \
    --capabilities CAPABILITY_IAM \
    --no-fail-on-empty-changeset

processorResource=$(aws cloudformation describe-stack-resource \
  --stack-name sqs-processor-lambda-pipeline \
  --logical-resource-id SqsProcessorLambda)

physicalprocessorResource=$(echo $processorResource | jq -r '.StackResourceDetail.PhysicalResourceId')

echo "::set-output name=processor_lambda_function_name::$physicalprocessorResource"
