const redis = require("redis")

const client = redis.createClient({
  socket: {
    host: "127.0.0.1", // force IPv4
    port: 6379,
  },
});

client.on("error" , (err) => {
    console.log("Redis connection error" , err);
})

client.on("connect" , () => {
    console.log("✅ Connected to Redis");
})

client.connect();

module.exports = client;