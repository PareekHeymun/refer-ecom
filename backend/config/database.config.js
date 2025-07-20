require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
let reconnectAttempts = 0;
const maxReconnectAttempts = 10;

function connectWithRetry() {
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('Database connected');
      reconnectAttempts = 0;
    })
    .catch((err) => {
      reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000); // exponential backoff, max 30s
      console.log(`Error connecting to database (attempt ${reconnectAttempts}):`, err.message);
      if (reconnectAttempts < maxReconnectAttempts) {
        console.log(`Retrying in ${delay / 1000}s...`);
        setTimeout(connectWithRetry, delay);
      } else {
        console.error('Max reconnect attempts reached. Exiting.');
        process.exit(1);
      }
    });
}

connectWithRetry();

mongoose.connection.on('disconnected', () => {
  console.log('Database disconnected. Attempting to reconnect...');
  connectWithRetry();
});

process.on('SIGINT', async ()=> {
    await mongoose.connection.close();
    console.log('Terminated program');
    process.exit(0);
});