import axios from "axios"

const startWorker = async (consumer: any, producer: any): Promise<void> => {

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

    const { webhookUrl, message, jobId } = job  // ✅ moved outside try so catch can access jobId

    try {
        // send alert
        await axios.post(webhookUrl, {
            text: message
        })

        console.log("Webhook sent successfully")

        // send success reply to MQ
        await mqProducer.send({
            topic: "webhook-replies",
            messages: [
                {
                    key: jobId,
                    value: JSON.stringify({
                        status: "SUCCESS",
                        jobId
                    })
                }
            ]
        })

    } catch (err: any) {

        console.error("Webhook failed", err.message)

        await mqProducer.send({
            topic: "webhook-replies",
            messages: [
                {
                    key: jobId, 
                    value: JSON.stringify({
                        status: "FAILED",
                        jobId,
                        error: err.message
                    })
                }
            ]
        })
    }
}

export { startWorker }