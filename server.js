const app = require('./src/app');
const config = require('./src/config/server');
const logger = require('./src/utils/logger');

// 서버 시작
app.listen(config.port, () => {
  logger.info(`CareCircle Server is running on http://localhost:${config.port} : Environment: ${config.env}`);
});