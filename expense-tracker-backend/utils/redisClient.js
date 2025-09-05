const redis = require("redis")

const client = redis.createClient({
  url: process.env.UPSTASH_REDIS_URL, // Use your Upstash Redis URL from .env
});

client.on("error" , (err) => {
    console.log("Redis connection error" , err);
})

client.on("connect" , () => {
    console.log("✅ Connected to Upstash Redis");
})

client.connect();

module.exports = client;