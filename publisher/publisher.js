const amqp = require('amqplib');
const queueName = 'paymentRequest';
const message = "Payment Requst3"


async function sendToQueue(message, queueName) {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
     console.log(`${queueName} Queue is ready to publish message`);
    await channel.assertQueue(queueName, { durable: false });
    channel.sendToQueue(queueName, Buffer.from(message));

    setTimeout(() => {
        connection.close();
    }, 500);
}

// Export the function properly
//module.exports = sendToQueue;

// Example usage:
// const sendToQueue = require('./path-to-your-file');
// const message = 'Hello, RabbitMQ!';
 sendToQueue(message,queueName);
