import Redis from "ioredis";

const redis = new Redis({
  host: "localhost",
  port: 6379,
});

async function checkRedis() {
  try {
    const list = await redis.smembers("monitored_contracts");
    console.log("Monitored contracts in Redis:", list);
    process.exit(0);
  } catch (err) {
    console.error("Redis error:", err);
    process.exit(1);
  }
}

checkRedis();
