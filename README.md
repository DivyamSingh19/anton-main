# Kaizen: Active Smart Contract Monitoring & Threat Detection

Kaizen is a comprehensive, real-time monitoring and threat detection pipeline for EVM smart contracts. It combines mempool analysis, timeseries data processing, and machine learning to identify and mitigate protocol risks autonomously.

## 🔗 Related Repositories

- **Frontend UI**: [kaizen-ui](https://github.com/DivyamSingh19/kaizen-ui)
- **Smart Contracts**: [kaizen-contracts](https://github.com/DivyamSingh19/kaizen-contracts)

## 🚀 Overview

Kaizen monitors the Ethereum mempool for transactions interacting with registered contracts. It calculates real-time metrics, evaluates them against ML-driven anomaly detection models, and can trigger autonomous protective measures (like kill-switches) via Kafka-driven alerts.

## 🏗 Architecture

The system is composed of several specialized services:

- **Primary API (`/api`)**: The central hub for user management, project registration, and timeseries data retrieval. [Express/Prisma/PostgreSQL]
- **WebSocket Monitor (`/ws`)**: A high-performance mempool listener that filters transactions in real-time. [Node.js/Bun/Redis]
- **ML Anomaly Server**: A FastAPI server that evaluates transaction metrics against Isolation Forest and Random Forest models to determine risk scores. [FastAPI/Python/Scikit-Learn]
- **Alert Worker (`/alert-worker`)**: Consumes threat alerts and distributes them across various channels (Discord, Slack, Webhooks).
- **Orchestrator**: Manages cross-service communication and task queuing via RabbitMQ.
- **Engine**: Core execution logic for protocol-level interventions.

## 🛠 Tech Stack

- **Languages**: TypeScript, Python, Solidity
- **Database**: PostgreSQL (Prisma), InfluxDB (Timeseries), MongoDB (Logs), Redis (Real-time state)
- **Messaging**: Kafka (Global events), RabbitMQ (Internal tasks)
- **Monitoring**: Alchemy (Mempool WebSocket)
- **Infrastructure**: Docker & Docker Compose

## 📊 Monitored Metrics (21 Features)

Kaizen tracks 21 distinct metrics for every transaction, including:
- **Flow Metrics**: `total_eth_outflow`, `total_eth_inflow`, `net_flow`.
- **Function Metrics**: `admin_function_called`, `total_function_calls`, `unique_callers`.
- **Anomalous Patterns**: `outflow_zscore`, `caller_zscore`, `new_caller_ratio`.
- **Gas Metrics**: `avg_gas_price`, `gas_price_ratio_to_network`.

## 🚦 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- [Bun](https://bun.sh/) or [Node.js](https://nodejs.org/)
- Alchemy API Key (for RPC/WebSocket)

### Setup

1. **Infrastructure**:
   ```bash
   docker-compose up -d
   ```

2. **Primary API**:
   ```bash
   cd api
   npm install
   npx prisma generate
   npm run dev
   ```

3. **WebSocket Monitor**:
   ```bash
   cd ws
   bun install
   bun run dev
   ```

4. **ML Server**:
   ```bash
   # Run your FastAPI server (default port 8000)
   python server.py
   ```

## 🛡 Security Actions

When the ML model detects a high-risk event, it can trigger:
- **LOG_SILENT**: Continuous monitoring without interruption.
- **ALERT_ONLY**: Notifies the user via Discord/Slack.
- **ALERT_RECOMMEND_PAUSE**: Alerts the user and recommends a manual pause.
- **AUTONOMOUS_KILL_SWITCH**: Directly triggers the protocol's pause mechanism via the multisig/guardian engine.

---

Built with ❤️ for a safer DeFi ecosystem.
