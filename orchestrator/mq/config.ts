import amqplib from "amqplib";

const queue = "webhook-jobs";

export const connectMQ = async () => {
  try {
    const connection = await amqplib.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });
    return { connection, channel, queue };
  } catch (err) {
    console.error("Failed to connect to RabbitMQ", err);
    throw err;
  }
};
