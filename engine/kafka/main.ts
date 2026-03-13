import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "kaizen-engine",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

const run = async () => {
  await producer.connect();
  console.log("Producer connected to Kafka");
};

run().catch(console.error);