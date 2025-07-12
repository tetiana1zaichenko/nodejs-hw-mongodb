import dotenv from 'dotenv';
// import { initMongoDB } from './db/initMongoDB.js';
// import { initMongoDB } from './db/initMongoConnection.js';
// import { startServer } from './server.js';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';
import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

dotenv.config();

console.log('🧪 ENV MONGODB_URL:', process.env.MONGODB_URL); //

async function startApp() {
  await initMongoConnection();
  setupServer();
}

startApp();

const bootstrap = async () => {
  await initMongoConnection();
  await createDirIfNotExists(TEMP_UPLOAD_DIR);
  await createDirIfNotExists(UPLOAD_DIR);
  setupServer();
};

void bootstrap();

// setupServer();
