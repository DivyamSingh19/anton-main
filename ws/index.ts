import express from "express";
import http from "http";
import axios from "axios";
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
const alertProducer = kafka.producer();

const startKafkaConsumer = async () => {
  try {
    await alertProducer.connect();
    logger.info("✅ Kafka WS Alert Producer Connected");
    await consumer.connect();
    await consumer.subscribe({ topic: "new-contracts", fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ message }: { message: any }) => {
        if (message.value) {
          const payload = JSON.parse(message.value.toString());
          const { action, contractAddress } = payload;
          
          if (action === "START") {
            logger.info(`Kafka: Received new contract to start monitoring: ${contractAddress}`);
            await redis.sadd("monitored_contracts", contractAddress.toLowerCase());
          } else if (action === "PAUSE") {
            logger.info(`Kafka: Received contract to pause monitoring: ${contractAddress}`);
            await redis.srem("monitored_contracts", contractAddress.toLowerCase());
          } else {
            // Fallback for older messages
            if (contractAddress && !action) {
               logger.info(`Kafka: Received legacy contract start monitoring: ${contractAddress}`);
               await redis.sadd("monitored_contracts", contractAddress.toLowerCase());
            }
          }
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
    params: ["newPendingTransactions", { fullTransactions: true }]
  }));
});

import { writeMetrics, TransactionMetrics } from "./influx/config";

alchemyWs.on("message", async (msg) => {
  try {
    const data = JSON.parse(msg.toString());
    if (data.params && data.params.result) {
      let tx = data.params.result;
      
      // If Alchemy only sends the hash, we must fetch the full transaction to see 'to/from'
      if (typeof tx === 'string') {
        try {
          const rpcUrl = process.env.RPC_URL?.replace("wss://", "https://") || "";
          const response = await axios.post(rpcUrl, {
            jsonrpc: "2.0",
            id: 2,
            method: "eth_getTransactionByHash",
            params: [tx]
          });
          if (response.data && response.data.result) {
            tx = response.data.result;
          } else {
            return; // Skip if we can't get details
          }
        } catch (err) {
          logger.error(`Failed to fetch tx details for hash ${tx}`, { error: err });
          return;
        }
      }

      const addressesToCheck = [];
      if (tx.to) addressesToCheck.push(tx.to.toLowerCase());
      if (tx.from) addressesToCheck.push(tx.from.toLowerCase());

      for (const addr of addressesToCheck) {
        const isMonitored = await redis.sismember("monitored_contracts", addr);
        if (isMonitored) {
          logger.info(`Monitored contract hit! Address: ${addr} | Hash: ${tx.hash}`);

          // Basic calculations for instantaneous metrics based on a single tx 
          // (More complex tracking like 7d avg requires historical db lookups or redis state)
          const isOutflow = tx.from && tx.from.toLowerCase() === addr;
          const valueInEth = tx.value ? parseInt(tx.value, 16) / 1e18 : 0;
          
          const metrics: TransactionMetrics = {
            total_eth_outflow: isOutflow ? valueInEth : 0,
            total_eth_inflow: !isOutflow ? valueInEth : 0,
            net_flow: !isOutflow ? valueInEth : -valueInEth,
            largest_single_transfer: valueInEth,
            transfer_count: 1, // instantaneous
            unique_callers: 1,
            total_function_calls: 1,
            new_caller_ratio: 0, // Placeholder
            admin_function_called: 0, // Placeholder
            new_admin_address: 0, 
            avg_gas_price: tx.gasPrice ? parseInt(tx.gasPrice, 16) / 1e9 : 0, // in Gwei
            gas_price_ratio_to_network: 1, // Placeholder
            token_transfer_volume: 0, // Need ERC20 decode for this
            voting_power_concentration: 0,
            delegation_spike: 0,
            outflow_vs_7d_avg: 0,
            outflow_zscore: 0,
            caller_zscore: 0,
            calls_per_caller: 1,
            outflow_per_transfer: isOutflow ? valueInEth : 0,
            inflow_outflow_ratio: !isOutflow ? 1 : 0
          };

          await writeMetrics(addr, metrics);

          // ---------------------------------------------------------
          // ML Server Integration
          // ---------------------------------------------------------
          const mlServerUrl = process.env.ML_SERVER_URL || "http://127.0.0.1:8000";
          try {
            const mlResponse = await axios.post(`${mlServerUrl}/analyze_block`, metrics);
            const { risk_score, risk_level, action, attack_type } = mlResponse.data;

            logger.info(`ML Classification for ${addr}: Risk: ${risk_level} (${risk_score}) | Action: ${action} | Type: ${attack_type}`);

            // Dispatch Alert to primary processing if risk needs attention
            if (
              action === "ALERT_ONLY" || 
              action === "ALERT_RECOMMEND_PAUSE" || 
              action === "AUTONOMOUS_KILL_SWITCH"
            ) {
               await alertProducer.send({
                 topic: "threat-alerts",
                 messages: [{
                   value: JSON.stringify({
                     contractAddress: addr,
                     transactionHash: tx.hash,
                     riskScore: risk_score,
                     riskLevel: risk_level,
                     recommendedAction: action,
                     attackType: attack_type,
                     timestamp: new Date().toISOString()
                   })
                 }]
               });
               logger.info(`🚨 Dispatched Kafka Threat Alert for ${addr}`);
            }

          } catch (mlErr: any) {
            logger.error(`ML Server unreachable or failed for ${addr}`, { 
              error: mlErr.message,
              details: mlErr.response?.data 
            });
          }
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