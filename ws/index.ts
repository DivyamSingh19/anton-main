import express from "express";
import http from "http";
import WebSocket from "ws";
import dotenv from "dotenv";
import connectDB from "./secondary-db/config";
import { Kafka } from "kafkajs";
import redis from "./redis/main";
import logger from "./utils/logger";

dotenv.config();

const app = express();
const port = 4002;

// Initialize MongoDB connection
connectDB()
// Kafka Configuration
const kafka = new Kafka({
  clientId: "secondary-server",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "ws-group" });

const startKafkaConsumer = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: "new-contracts", fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ message }: { message: any }) => {
        if (message.value) {
          const { projectId, contractAddress } = JSON.parse(message.value.toString());
          logger.info(`Kafka: Received new contract for monitoring: ${contractAddress}`);
          // Add to Redis monitoring SET (Port 6379)
          await redis.sadd("monitored_contracts", contractAddress);
        }
      },
    });
  } catch (err) {
    logger.error("Kafka consumer error", { error: err });
  }
};

startKafkaConsumer();
 
const alchemyWs = new WebSocket(process.env.RPC_URL as string);

alchemyWs.on("open", () => {
  logger.info("Connected to Alchemy/RPC WebSocket for Mempool Monitoring");
  alchemyWs.send(JSON.stringify({
    id: 1,
    method: "eth_subscribe",
    params: ["newPendingTransactions"]
  }));
});

alchemyWs.on("message", async (msg) => {
  try {
    const data = JSON.parse(msg.toString());
    if (data.params && data.params.result) {
      const tx = data.params.result;
      
      const addressesToCheck = [];
      if (tx.to) addressesToCheck.push(tx.to.toLowerCase());
      if (tx.from) addressesToCheck.push(tx.from.toLowerCase());

      for (const addr of addressesToCheck) {
        const isMonitored = await redis.sismember("monitored_contracts", addr);
        if (isMonitored) {
          logger.info(` Monitored contract hit! Address: ${addr} | Hash: ${tx.hash}`, {
            metadata: {
              isMempoolEvent: true,
              eventData: {
                contractAddress: addr,
                transactionHash: tx.hash,
                from: tx.from,
                to: tx.to,
                value: tx.value,
                timestamp: new Date()
              }
            }
          });
        }
      }
    }
  } catch (err) {
    logger.error("Mempool processing error", { error: err });
  }
});

alchemyWs.on("error", (err) => {
  logger.error("WebSocket error", { error: err });
});

alchemyWs.on("close", () => {
  logger.info("WebSocket connection closed. Attempting to reconnect...");
  // Reconnection logic could go here
});

// Express Server
app.get("/health", (req: express.Request, res: express.Response) => {
  res.json({ status: "UP", service: "kaizen-monitor-ws" });
});

app.listen(port, () => {
  logger.info(`WS Monitor Express server running on port ${port}`);
});