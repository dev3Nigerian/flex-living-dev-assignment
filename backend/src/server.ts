import app from './app';
import { PORT } from './config';

const server = app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`⚡️ Flex Reviews API is running on http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  server.close(() => {
    // eslint-disable-next-line no-console
    console.log('Server closed gracefully');
    process.exit(0);
  });
});

process.on('unhandledRejection', (reason) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled promise rejection', reason);
});

