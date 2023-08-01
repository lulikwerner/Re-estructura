import bcrypt from 'bcrypt';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import config from '../config.js';
import LoggerService from '../services/LoggerService.js';



const logger = new LoggerService(config.logger.type); 
//import userModel from '../dao/mongo/models/tickets.js';

export const createHash = async (password) => {
  const salts = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salts);
}

export const isValidPassword = (password, hashedPassword) => bcrypt.compareSync(password, hashedPassword);

export const passportCall = (strategy, options = {}) => {
  return async (req, res, next) => {
    logger.logger.debug('entro al passport');
    passport.authenticate(strategy, (error, user, info) => {
      if (error) return next(error);
      if (!options.strategyType) {
        logger.logger.info(`La ruta ${req.url} No tiene definida un tipo de estrategia`);
        return res.sendServerError();
      }
      if (!user) {
        switch (options.strategyType) {
          case 'jwt':
            req.error = info && info.message ? info.message : 'User not found';
            return next();
          case 'locals':
            logger.logger.debug('el tema es locals');

            return res.sendUnauthorized(info && info.message ? info.message : 'User not found');
        }
      }
      req.user = user;
      logger.logger.info(user);
      next();
    })(req, res, next);
  };
};

export const generateToken = (user) => {
  try {
    logger.logger.info(user);
    return jwt.sign(JSON.parse(JSON.stringify(user)), config.tokenKey.key, { expiresIn: '1d' });
  } catch (error) {
    console.error('Token generation error:', error);
    throw error;
  }
};


/*export const generateTicket = async (cid) => {
  try {
    const code = generateUniqueCode();

    const ticket = new userModel({
      code: code,
      purchaser: cid,
      amount: 0, 
    });

    await ticket.save();
    
  } catch (error) {
    console.error('Ticket generation error:', error);
    throw error;
  }
}*/