const Redis = require("ioredis");

const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,
});

redis.on("connect", () => {
  console.log("Status: Successfully connected to the Redis server.");
});

redis.on("error", (err) => {
  console.error("Status: Failed to connect to Redis.", err);
});

module.exports = redis;
