const redis = require("redis")

const client = redis.createClient();

client.on("error" , (err) => {
    console.log("Redis connection error" , err);
})

client.on("connect" , () => {
    console.log("✅ Connected to Redis");
})

client.connect();

module.exports = client;