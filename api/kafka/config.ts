 import { Kafka } from "kafkajs"

export const kafka = new Kafka({
  clientId: "primary-server",
  brokers: ["localhost:9092"]
})