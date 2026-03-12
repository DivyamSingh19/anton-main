import axios from "axios"
import { createClient } from "redis"

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

const startWorker = async (consumer: any, producer: any, redisClient: ReturnType<typeof createClient>): Promise<void> => {

    await startHeartbeat(redisClient)
 
    process.on("SIGINT", async () => {
        await stopHeartbeat(redisClient)
        process.exit(0)
    })
    process.on("SIGTERM", async () => {
        await stopHeartbeat(redisClient)
        process.exit(0)
    })

    await consumer.subscribe({
        topic: "webhook-jobs",
        fromBeginning: false
    })

    await consumer.run({
        eachMessage: async ({ message }: { message: any }) => {
            const job = JSON.parse(message.value.toString())
            await processWebhookJob(job, producer)
        }
    })
}

const processWebhookJob = async (job: any, mqProducer: any): Promise<void> => {

    const { webhookUrl, message, jobId } = job

    try {
        await axios.post(webhookUrl, { text: message })

        console.log("Webhook sent successfully")

        await mqProducer.send({
            topic: "webhook-replies",
            messages: [{ key: jobId, value: JSON.stringify({ status: "SUCCESS", jobId }) }]
        })

    } catch (err: any) {

        console.error("Webhook failed", err.message)

        await mqProducer.send({
            topic: "webhook-replies",
            messages: [{ key: jobId, value: JSON.stringify({ status: "FAILED", jobId, error: err.message }) }]
        })
    }
}

export { startWorker }
