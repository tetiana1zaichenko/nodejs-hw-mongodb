import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

export function setupServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(pino());

  app.get('/', (req, res) => {
    res.send({ message: 'Welcome to the server!' });
  });

  // Обработка несуществующих роутов
  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
