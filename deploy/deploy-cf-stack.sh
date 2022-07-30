#!/bin/bash

set -e

if [[ -z "${RULES_ENGINE_LAMBDA}" ]]; then
  echo Missing RULES_ENGINE_LAMBDA
  exit 1
fi

templateFile='./deploy/template.yml'

aws cloudformation deploy \
    --stack-name sqs-processor-lambda-pipeline \
    --template-file $templateFile \
    --capabilities CAPABILITY_IAM \
    --no-fail-on-empty-changeset \
    --parameter-overrides \
        RulesEngineLambda=$RULES_ENGINE_LAMBDA

processorResource=$(aws cloudformation describe-stack-resource \
  --stack-name sqs-processor-lambda-pipeline \
  --logical-resource-id SqsProcessorLambda)

physicalprocessorResource=$(echo $processorResource | jq -r '.StackResourceDetail.PhysicalResourceId')

echo "::set-output name=processor_lambda_function_name::$physicalprocessorResource"
