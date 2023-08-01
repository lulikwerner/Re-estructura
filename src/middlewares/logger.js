import LoggerService from '../services/LoggerService.js';
import config from '../config.js';

const logger = new LoggerService(config.logger.type);

const attachLogger = (req, res, next) => {
  req.logger = logger.logger;
  req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
  next();
};

export default attachLogger;
