import { fileURLToPath } from 'url';
import { dirname } from 'path';
import LoggerService from '../src/services/LoggerService.js';
import config from './config.js';


const logger = new LoggerService(config.logger.type); 

export const cookieExtractor = (req) => {
  let token = null;
  console.log('paso3')
  logger.logger.debug('entro en extractor');

  
  if (req && req.cookies) {
    token = req.cookies['authToken'];
    console.log('token',token)
  }
  
  // Maneja socket.io connection
  if (!token && req && req.headers && req.headers.cookie) {
    logger.logger.debug('Extraemos con el header');
    const cookie = req.headers.cookie;
    const cookieRegex = /authToken=([^;]+)/;  
    const match = cookie.match(cookieRegex);
    if (match) {
      token = match[1];
      logger.logger.info('Token from headers:', token);
    }
  }
  
  return token;

};



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export { __dirname };
