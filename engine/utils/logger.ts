import winston from "winston"
import "winston-mongodb"

const logger = winston.createLogger({
  level: "info",

  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),

  transports: [
    // Console logger
    new winston.transports.Console({
      format: winston.format.simple()
    }),

    // MongoDB logger
    new winston.transports.MongoDB({
      db: process.env.MONGO_URI!,
      collection: "logs",
      level: "info",
      options: {
        useUnifiedTopology: true
      },
      tryReconnect: true
    })
  ],

  exceptionHandlers: [
    new winston.transports.MongoDB({
      db: process.env.MONGO_URI!,
      collection: "exceptions"
    })
  ]
})

export default logger