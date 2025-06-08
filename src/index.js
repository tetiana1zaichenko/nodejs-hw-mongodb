import dotenv from 'dotenv';
dotenv.config();

console.log('🧪 ENV MONGODB_URL:', process.env.MONGODB_URL); //

import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

async function startApp() {
  await initMongoConnection();
  setupServer();
}

startApp();

setupServer();
