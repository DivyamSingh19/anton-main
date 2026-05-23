import {kafka} from "./config"
export const consumer = kafka.consumer({
  groupId: "kaizen-api",
})

export const producer = kafka.producer({})
export async function startConsumer() {
  await consumer.connect()

  await consumer.subscribe({
    topic: "user-events",
    fromBeginning: true
  })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
        console.log({
            value: message.value?.toString(),
            topic,
            partition
        })
    }   
    })
}