//import { usersServices } from '../dao/mongo/managers/index.js';
import { generateToken } from '../services/auth.js';
import {userService}  from '../services/repositories.js'
import LoggerService from '../services/LoggerService.js';
import config from '../config.js';
import { UsageRecordInstance } from 'twilio/lib/rest/wireless/v1/usageRecord.js';
import { usersServices } from '../dao/mongo/managers/index.js';


const logger = new LoggerService(config.logger.type); 



const register = (req,res) => {
    res.sendSuccess()
  };

  const login = (req, res) => {
    console.log('login')
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

const profileRole = async (req,res) => {
  const { uid } = req.params;
  try {
    const user= await userService.getUserByService({_id: uid})
    logger.logger.debug(user);
    // Si no encuentra el user
    if (!user) {
      return res.sendBadRequest('User not found');
    }
    // Si el user se encuentra renderizo la info
    res.render('userRole', { userh: user});
} catch (error) {
    return res.sendInternalError(error);
}
}

const selectRole = async (req,res) => {
  const {uid} = req.params
 const role = req.body

  const newRole = await usersServices.updateUsers({_id:uid},role)
  console.log(newRole)
}

  export default{
    register,
    login,
    logout,
    loginGithub,
    loginGitHubCallback,
    current,
    profileRole,
    selectRole,
  }