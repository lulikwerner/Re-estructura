import { cookieExtractor } from '../utils.js';
import config from '../config.js';
import jwt from 'jsonwebtoken';
import LoggerService from '../services/LoggerService.js';



const logger = new LoggerService(config.logger.type); 

const verifyCart = (req, res, next) => {

    const token = cookieExtractor(req);
    //Extraigo la informacion del TOKEN 
    const decodedToken = jwt.verify(token, config.tokenKey.key);
    const cartInURL = req.params.cid;
    logger.logger.info(decodedToken.cart)
    logger.logger.info(decodedToken.role)
    logger.logger.info(cartInURL)
    //Digo si el rol es user comparo el cart enviado en params con el que tiene el usuario guardado. Si son diferentes devuelvo un forbidden
if(decodedToken.role ==='user'){
        if(decodedToken.cart !== req.params.cid)return res.status(403).send({ status: "error", error: "Forbidden" });
}
return next();
};

export default verifyCart;



