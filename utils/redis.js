import Redis from "ioredis";

// Check if Redis should be enabled (Docker sets REDIS_HOST)
const REDIS_ENABLED = !!process.env.REDIS_HOST;

// Redis connection configuration
const redisConfig = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => {
    // Stop retrying after 3 attempts in local dev (no Redis)
    if (!REDIS_ENABLED && times >= 1) {
      console.log("⚠️  Redis not available - using in-memory rate limiting");
      return null; // Stop retrying
    }
    // In Docker, keep retrying with exponential backoff
    return Math.min(times * 100, 3000);
  },
  lazyConnect: true,
};

let redis = null;

if (REDIS_ENABLED) {
  redis = new Redis(redisConfig);

  redis.on("connect", () => {
    console.log("✅ Redis connected successfully");
  });

  redis.on("error", (err) => {
    console.error("❌ Redis connection error:", err.message);
  });

  redis.on("close", () => {
    console.log("🔌 Redis connection closed");
  });
} else {
  console.log(
    "ℹ️  Redis disabled (REDIS_HOST not set) - using in-memory rate limiting"
  );
}

export default redis;
export { REDIS_ENABLED };
