import LoggerService from '../services/LoggerService.js'
import config from '../config.js';

const logger =  new LoggerService(config.logger.type) 

export default (error,req,res,next) => { //Este define que nunca caiga el Server
    logger.logger.error(error)
    res.status(error.status).send({status:'error', error:error.message})
   
}