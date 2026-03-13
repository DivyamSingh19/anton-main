import axios from "axios"
import { createClient } from "redis"
import { Kafka } from "kafkajs"

const WORKER_ID = `worker-${process.pid}-${Date.now()}`
const HEARTBEAT_INTERVAL_MS = 5000
const HEARTBEAT_TTL_SECONDS = 15  // orchestrator considers worker dead if TTL expires

const startHeartbeat = async (redisClient: ReturnType<typeof createClient>): Promise<void> => {

    const sendHeartbeat = async () => {
        try {
            await redisClient.set(
                `workers:${WORKER_ID}`,
                JSON.stringify({
                    workerId: WORKER_ID,
                    status: "UP",
                    lastSeen: new Date().toISOString(),
                    pid: process.pid
                }),
                { EX: HEARTBEAT_TTL_SECONDS }  
            )
        } catch (err: any) {
            console.error("Heartbeat failed", err.message)
        }
    }

    await sendHeartbeat()   
    setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS)
}

const stopHeartbeat = async (redisClient: ReturnType<typeof createClient>): Promise<void> => {
    await redisClient.del(`workers:${WORKER_ID}`)
    console.log(`Worker ${WORKER_ID} deregistered from Redis`)
}

const kafka = new Kafka({
  clientId: WORKER_ID,
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "alert-worker-group" });

const startWorker = async (): Promise<void> => {
    const redisClient = createClient()
    await redisClient.connect()

    await startHeartbeat(redisClient)
 
    process.on("SIGINT", async () => {
        await stopHeartbeat(redisClient)
        process.exit(0)
    })
    process.on("SIGTERM", async () => {
        await stopHeartbeat(redisClient)
        process.exit(0)
    })

    await consumer.connect()
    console.log(`Worker ${WORKER_ID} connected to Kafka`)

    await consumer.subscribe({
        topic: "threat-alerts",
        fromBeginning: false
    })

    await consumer.run({
        eachMessage: async ({ message }: { message: any }) => {
            const job = JSON.parse(message.value.toString())
            await processWebhookJob(job)
        }
    })
}

const processWebhookJob = async (job: any): Promise<void> => {

    const { webhookUrl, message, jobId } = job

    try {
        await axios.post(webhookUrl, { text: message })
        console.log(`Webhook sent successfully to ${webhookUrl}`)
    } catch (err: any) {
        console.error(`Webhook failed for ${webhookUrl}`, err.message)
    }
}

// Start immediately when file is run directly
if (require.main === module) {
    startWorker().catch(console.error)
}

export { startWorker }
