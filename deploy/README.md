# Deployment

To deploy run [./deploy-cf-stack.sh](./deploy-cf-stack.sh) to deploy the CloudFormation template defined in [./template.yml].

Then run [./deploy-function-code.sh](deploy-function-code.sh) to compile the function code and update the lambda function.

Deployment scripts run in a [github action](sqs-processor-switch/.github/workflows/deploy-stack.yml) which requires the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` for a user with permissions to deploy to the desired AWS account.
