import WebSocketServer from "ws"
import dotenv from "dotenv"
import connectDB from "./secondary-db/config"

dotenv.config()
import WebSocket from "ws"

const ws = new WebSocket(process.env.RPC_URL as string)

ws.on("open", () => {
  ws.send(JSON.stringify({
    id: 1,
    method: "eth_subscribe",
    params: ["newPendingTransactions"]
  }))
})

ws.on("message", (msg) => {
  console.log(JSON.parse(msg.toString()))
})