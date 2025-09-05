const redis = require("redis")
const { Redis } = require("@upstash/redis");

const client = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL, // e.g., https://modest-gannet-21278.upstash.io
    token: process.env.UPSTASH_REDIS_REST_TOKEN, // your Upstash REST token
});

client.on("error" , (err) => {
    console.log("Redis connection error" , err);
})

client.on("connect" , () => {
    console.log("✅ Connected to Upstash Redis");
})

client.connect();

module.exports = client;