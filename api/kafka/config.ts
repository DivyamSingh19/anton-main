import { Kafka, Producer } from "kafkajs";

export const kafka = new Kafka({
  clientId: "primary-api",
  brokers: ["localhost:9092"],
});

let producer: Producer;
let isConnected = false;

export const initKafkaProducer = async () => {
  if (!producer) {
    producer = kafka.producer();
  }

  if (!isConnected) {
    await producer.connect();
    isConnected = true;
    console.log("✅ Kafka Producer Connected");
  }
};

const safeSend = async (topic: string, payload: any) => {
  try {
    if (!isConnected) {
      await initKafkaProducer();
    }

    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(payload) }],
    });
  } catch (err) {
    console.log("⚠️ Kafka send failed. Reconnecting...");

    isConnected = false;
    await initKafkaProducer();

    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(payload) }],
    });
  }
};

export const pushNewContract = async (
  projectId: string,
  contractAddress: string,
  fingerprint: any
) => {
  await safeSend("new-contracts", { projectId, contractAddress, fingerprint });
};

export const pushThreatAlert = async (
  webhookUrl: string,
  message: string
) => {
  await safeSend("threat-alerts", { webhookUrl, message });
};

export const pushKillSwitchAction = async (data: {
  action: "KILLSWITCH" | "TIMLOCK";
  contractAddress: string;
  tx: string;
  allowedActions: "KILLSWITCH" | "TIMELOCK" | "BOTH";
}) => {
  await safeSend("kill-switch-actions", data);
};

export const pushPauseContract = async (
  projectId: string,
  contractAddress: string,
) => {
  await producer.send({
    topic:"new-contracts",  
    messages: [
      {
        key: contractAddress,
        value: JSON.stringify({
          action: "PAUSE",
          projectId,
          contractAddress,
          timestamp: Date.now(),
        }),
      },
    ],
  });
};