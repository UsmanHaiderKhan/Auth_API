const redis = require('redis');

const client = redis.createClient({
  port: 6379,
  host: '127.0.0.1',
});

client.on('connect', () => {
  console.log('Client Connected to the redis server.');
});

client.on('ready', () => {
  console.log('Client Connected to the redis and ready to use.');
});

client.on('error', (err) => {
  console.log(err.message);
});

client.on('end', () => {
  console.log('Client has been  disConnected to the redis server.');
});

client.on('SIGINT', () => {
  client.quit();
});

module.exports = client;
