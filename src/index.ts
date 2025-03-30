import { config } from './config';
import { connectDatabase } from './config/database';
import app from './app/app';
import { logger } from './utils/logger';
connectDatabase();

app.listen(config.port, () => {
  logger.info(`🚀 [server]: Server launched successfully!`);
  logger.info(`⚡️ [server]: API is live at http://localhost:${config.port}`);
  logger.info(`🔥 [server]: Environment: ${config.nodeEnv}`);
  logger.info(`💪 [server]: Ready to handle requests`);
});

export default app;
