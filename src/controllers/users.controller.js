//import { usersServices } from '../dao/mongo/managers/index.js';
import jwt from 'jsonwebtoken';
import { generateToken } from '../services/auth.js';
import {userService}  from '../services/repositories.js'
import LoggerService from '../services/LoggerService.js';
import config from '../config.js';
import { UsageRecordInstance } from 'twilio/lib/rest/wireless/v1/usageRecord.js';
import { usersServices } from '../dao/mongo/managers/index.js';
import RestoreTokenDTO from '../dto/user/RestoreTokenDTO.js';
import DTemplates from '../constants/DTemplates.js';
import MailingServices from '../services/mailService/mailService.js';
import { createHash, isValidPassword } from "../services/auth.js";


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

 const selectRole = async (req, res) => {
  try {
      const { uid } = req.params;
      console.log('hastaa')
      const role = req.body;
      console.log('elrol',role)
      const newRole = await userService.updateUsersService(uid, role);
      console.log('elnuevorole', newRole);
      res.status(200).json({ message: 'User role updated successfully', newRole });
  } catch (error) {
      logger.logger.error('Error updating user role:', error);
      res.status(500).json({ message: 'Failed to update user role', error });
  }
};

const restoreRequest = async (req,res) =>{
  const {email} = req.body;
  if(!email) return res.sendBadRequest('No se proporciono un email')
  const user = await userService. getUserByService({email})
  if(!user) return res.sendBadRequest('Email no valido')
  //Se crea el restoreToken
  const restoreToken = generateToken(RestoreTokenDTO.getFrom(user),3600);
  const mailingService = new MailingServices();
  const result = await mailingService.sendMail(user.email, DTemplates.RESTORE, {restoreToken})
  res.sendSuccess('Correo enviado exitosamente')
}

const restorePassword = async (req,res) => {
  const {password,token} = req.body;
  try{
    const tokenUser =jwt.verify(token, config.tokenKey.key)
    console.log(tokenUser.email)
    const user = await userService.getUserByService({email: tokenUser.email})
    console.log('eluser', user)
    //Verificar que la contrasenia no es la misma a la que ya tenia
    const isSamePassword = isValidPassword(password, user.password)
    console.log(isSamePassword)
    if(isSamePassword) res.sendBadRequest('Su nueva contrasenia no puede ser igual a la anterior');
    const newHashedPassword = await createHash(password)
    console.log(user._id)
    console.log(newHashedPassword)
    const updateuSER=await userService.updateUsersService(user._id,{password:newHashedPassword})
    console.log(updateuSER)
     res.sendSuccess('Contrasenia modificada exitosamente')
  }catch(error){
    console.log(error);
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
    selectRole,
    restoreRequest,
    restorePassword
  }