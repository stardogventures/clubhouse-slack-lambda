# clubhouse-slack-lambda

The Clubhouse Slack integration sends messages to Slack when stories are opened, but doesn't send a notification when stories are complete. Here's a quick way to hook that together that using AWS Lambda!

Suggestions, pull requests, comments, etc all welcome.

## Installation

1. Install a Slack Incoming Webhook app: http://slack.com/apps/A0F7XDUAZ-incoming-webhooks and note down the Webhook URL
2. From Clubhouse, create an API Token from Settings -> API Tokens
3. Create an AWS Lambda function named `clubhouse-webhook`
   - Set the following environment variables for the Lambda:
     - `SLACK_WEBHOOK_URL` - the Webhook URL from Slack
     - `SLACK_CHANNEL` - name of the Slack channel to post to
     - `CLUBHOUSE_API_TOKEN` - the Clubhouse API token
4. Push the code, including npm dependencies, to Lambda by running the following:

```
cd clubhouse-webhook; yarn install; zip -r ../clubhouse-webhook.zip .; cd ..
aws lambda update-function-code --function-name clubhouse-webhook --zip-file fileb://clubhouse-webhook.zip
rm clubhouse-webhook.zip
```

5. Create an AWS API Gateway POST endpoint that calls the Lambda function
6. From Clubhouse, create a Webhook from Integrations -> Webhooks and set the endpoint to the API Gateway URL
7. Move some stories to Completed, and watch the magic happen!
