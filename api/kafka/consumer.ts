// import {kafka} from "./config"
// export const consumer = kafka.consumer({
//   groupId: "express-group"
// })

// export async function startConsumer() {
//   await consumer.connect()

//   await consumer.subscribe({
//     topic: "user-events",
//     fromBeginning: true
//   })

//   await consumer.run({
//     eachMessage: async ({ topic, partition, message }) => {
//       const value = message.value.toString()

//       console.log("Received:", value)
//     }
//   })
// }