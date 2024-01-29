const amqp = require('amqplib');
const queue = 'paymentRequest';

const receiveFromQueue = async (connection, queue) => {
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: false });
    console.log('Waiting for messages. To exit press CTRL+C');

    channel.consume(queue, (message) => {
        const content = message.content.toString();
        console.log('Received message:', content);
        setTimeout(() => {
            channel.ack(message);
        }, 1000);
    }, { noAck: false });
};

// Create a connection and start receiving messages
const startReceiving = async () => {
    const connection = await amqp.connect('amqp://localhost');
    receiveFromQueue(connection, queue);
};

// Start receiving messages
startReceiving();

module.exports = {
    receiveFromQueue,
    startReceiving
};
