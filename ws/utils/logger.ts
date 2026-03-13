import winston from "winston";
import Transport from "winston-transport";
import { MempoolEvent } from "../models/Event";

// Custom Transport to log to MongoDB
class MongoTransport extends Transport {
  constructor(opts?: any) {
    super(opts);
  }

  async log(info: any, callback: () => void) {
    setImmediate(() => {
      this.emit("logged", info);
    });

    if (info.metadata && info.metadata.isMempoolEvent) {
      try {
        const event = new MempoolEvent(info.metadata.eventData);
        await event.save();
      } catch (err) {
        console.error("Failed to save mempool event to MongoDB", err);
      }
    }

    callback();
  }
}

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new MongoTransport(),
  ],
});

export default logger;
