const redis = require('redis');

const client = redis.createClient(); // Usa os defaults (localhost:6379)
client.connect().catch(console.error);

module.exports = client;