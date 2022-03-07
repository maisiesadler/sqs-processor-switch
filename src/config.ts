class Config {
    public readonly slackLambdaName = process.env.SLACK_LAMBDA_NAME
}

export default new Config();
