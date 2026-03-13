import { Kafka } from "kafkajs";
import { connectMQ } from "../mq/config";

const kafka = new Kafka({
  clientId: "orchestrator",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "orchestrator-group" });

export const startOrchestrator = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "threat-alerts", fromBeginning: true });

  const { channel, queue } = await connectMQ();

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (message.value) {
        const alert = JSON.parse(message.value.toString());
        console.log("Orchestrator received threat alert:", alert);

        // Forward to RabbitMQ for Alert-Worker
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(alert)), {
          persistent: true,
        });
      }
    },
  });
};

startOrchestrator().catch(console.error);