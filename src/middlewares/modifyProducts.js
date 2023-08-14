import { cookieExtractor } from '../utils.js';
import config from '../config.js';
import LoggerService from '../services/LoggerService.js';
import jwt from 'jsonwebtoken';
import { productService } from '../services/repositories.js';

const logger = new LoggerService(config.logger.type); 

const modifyProducts = async (req, res, next) => {
  const token = cookieExtractor(req);
  const decodedToken = jwt.verify(token, config.tokenKey.key);
  logger.logger.debug('miTokenenverify', decodedToken);
  const pidInURL = req.params.pid;
  try {
    logger.logger.debug('enlosparams', pidInURL);
    const product = await productService.getProductByService({_id:pidInURL});
    if(decodedToken.email==='adminCoder@coder.com') return next();
    // Check if the decoded token email matches the product owner
    if (decodedToken.email !== product.owner) return res.status(403).send({ status: 'error', error: 'Forbidden' });
    next();
  } catch (error) {
    logger.logger.error('Error fetching product:', error);

    // Handle the error and send an appropriate response
    return res.status(500).send('Error fetching product');
  }
};
export default modifyProducts;
