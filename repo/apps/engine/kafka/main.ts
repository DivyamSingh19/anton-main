import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "engine",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "engine-group" });

export const startEngineConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "kill-switch-actions", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (message.value) {
        const action = JSON.parse(message.value.toString());
        console.log("Engine received kill switch action:", action);
        // Logic for execution and timelocks would go here
      }
    },
  });
};

startEngineConsumer().catch(console.error);