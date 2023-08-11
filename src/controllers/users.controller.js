import { usersServices } from '../dao/mongo/managers/index.js';
import { generateToken } from '../services/auth.js';
import LoggerService from '../services/LoggerService.js';
import config from '../config.js';


const logger = new LoggerService(config.logger.type); 



const register = (req,res) => {

    res.sendSuccess()
  };

  const login = (req, res) => {
    // El login recibe SIEMPRE en req.user
    logger.logger.info('eluser',req.user);
    const token = generateToken(req.user);
    res.cookie('authToken', token, {
      maxAge: 1000 * 3600 * 24,
      httpOnly: true
    });
    // Send the response with user information
    res.sendSuccessWithPayload({ user: req.user });
  };

  const logout = (req, res, next) => {
    // Clear the auth token cookie
    res.clearCookie('authToken');
    // Redirect to the login page or send a success response
    res.redirect('/login');
  };

  const loginGithub = (req, res) => {

    res.send({ status: "success", message: "Logged in with GitHub" });
  };

  const loginGitHubCallback = (req, res) => {

    const user = req.user;
    logger.logger.info('user',user)

    logger.logger.debug('el usuario git', user);
    try {
      const token = generateToken(req.user);
      logger.logger.info('token', token);
      res.cookie('authToken', token, {
        maxAge: 1000 * 3600 * 24,
        httpOnly: true
      });
      logger.logger.debug('eltokenquenuevo',user);
       // Redirect the user to the /products page
      res.redirect('/products');

    } catch (error) {
      logger.logger.error('Error creating token:', error);
      res.sendInternalError (error);
    }
  };

  const current = (req, res) => {
    try {
        return res.sendSuccess(req.user);
    } catch (error) {
        return res.sendInternalError(error);
    }
};

const profileRole =(req,res) => {
  try {
    console.log(req.user)
    //return res.sendSuccess(req.user);
} catch (error) {
    return res.sendInternalError(error);
}
}


  export default{
    register,
    login,
    logout,
    loginGithub,
    loginGitHubCallback,
    current,
    profileRole,
  }