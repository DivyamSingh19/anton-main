import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "primary-api",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

export const connectProducer = async () => {
  await producer.connect();
};

export const pushNewContract = async (projectId: string, contractAddress: string) => {
  await producer.send({
    topic: "new-contracts",
    messages: [{ value: JSON.stringify({ projectId, contractAddress }) }],
  });
};

export const pushThreatAlert = async (webhookUrl: string, message: string) => {
  await producer.send({
    topic: "threat-alerts",
    messages: [{ value: JSON.stringify({ webhookUrl, message }) }],
  });
};

export const pushKillSwitchAction = async (data: {
  action: "KILLSWITCH" | "TIMLOCK";
  contractAddress: string;
  tx: string;
  allowedActions: "KILLSWITCH" | "TIMELOCK" | "BOTH";
}) => {
  await producer.send({
    topic: "kill-switch-actions",
    messages: [{ value: JSON.stringify(data) }],
  });
};