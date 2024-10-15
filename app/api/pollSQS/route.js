import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from '@aws-sdk/client-sqs';

const sqsClient = new SQSClient({ region: 'us-east-2' });
const queueUrl =
  'https://sqs.us-east-2.amazonaws.com/468348667459/SmartPicturesQ.fifo';

export async function GET() {
  try {
    console.log('Polling SQS...');
    const command = new ReceiveMessageCommand({
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 20, // Long polling: wait up to 20 seconds for a message
    });

    const response = await sqsClient.send(command);
    console.log('SQS Response:', JSON.stringify(response, null, 2));

    if (response.Messages && response.Messages.length > 0) {
      const message = response.Messages[0];
      console.log('Received message:', JSON.stringify(message, null, 2));

      const body = JSON.parse(message.Body);
      const notificationData = JSON.parse(body.Message);
      console.log('Parsed notification data:', notificationData);

      // Delete the message from the queue
      const deleteCommand = new DeleteMessageCommand({
        QueueUrl: queueUrl,
        ReceiptHandle: message.ReceiptHandle,
      });
      await sqsClient.send(deleteCommand);
      console.log('Message deleted from queue');

      return Response.json({ notification: notificationData });
    } else {
      console.log('No messages received');
      return Response.json({ notification: null });
    }
  } catch (error) {
    console.error('Error polling SQS:', error);
    return Response.json({ error: 'Error polling SQS' }, { status: 500 });
  }
}
