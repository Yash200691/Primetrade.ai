import Redis from "ioredis";
import { loadEnv } from "./env.js";

const env = loadEnv();

let redisAvailable = false;

// Create Redis client with retry configuration
export const redisClient = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => {
    // Stop retrying after 3 attempts
    if (times > 3) {
      console.warn("⚠️  Redis unavailable - caching disabled");
      return null;
    }
    return Math.min(times * 100, 2000);
  },
  lazyConnect: true
});

// Try to connect to Redis
redisClient.connect().then(() => {
  redisAvailable = true;
  console.log("✓ Redis connected");
}).catch(() => {
  console.warn("⚠️  Redis unavailable - continuing without cache");
});

redisClient.on("error", () => {
  // Suppress error spam - already logged in retryStrategy
});

export const isRedisAvailable = () => redisAvailable;
