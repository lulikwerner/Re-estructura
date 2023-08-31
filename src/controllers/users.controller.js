//import { usersServices } from '../dao/mongo/managers/index.js';
import jwt from "jsonwebtoken";
import { generateToken } from "../services/auth.js";
import { userService } from "../services/repositories.js";
import LoggerService from "../services/LoggerService.js";
import config from "../config.js";
import UserDTO from '../dto/user/userDTO.js'
import { UsageRecordInstance } from "twilio/lib/rest/wireless/v1/usageRecord.js";
import { usersServices } from "../dao/mongo/managers/index.js";
import RestoreTokenDTO from "../dto/user/RestoreTokenDTO.js";
import DTemplates from "../constants/DTemplates.js";
import MailingServices from "../services/mailService/mailService.js";
import { createHash, isValidPassword } from "../services/auth.js";
import nodemailer from 'nodemailer'


const logger = new LoggerService(config.logger.type);

const transport = nodemailer.createTransport({
  service:'gmail',
  port:587,
  auth:{
    user:config.app.email,
    pass:config.app.password
  }
})



const register = (req, res) => {
  res.sendSuccess();
};

const login = (req, res) => {
  console.log("login");
  // El login recibe SIEMPRE en req.user
  logger.logger.info("eluser", req.user);
  const token = generateToken(req.user);
  res.cookie("authToken", token, {
    maxAge: 1000 * 3600 * 24,
    httpOnly: true,
  });
  // Send the response with user information
  res.sendSuccessWithPayload({ user: req.user });
};

const logout = async (req, res, next) =>  {
  //Traigo el usuario logeado y busco la fecha del del momento
  const userRole = req.user.role.toString();
  if(userRole != 'ADMIN'){
  const userId = req.user._id.toString();
  const currentDate = Date.now();
//Actualizo el time connection por ser la ultima vez que tuvo actividad
  const updateTimeConnection = await usersServices.updateUsers(userId, { last_connection: currentDate })
  }
  // Limpio la cookie
  res.clearCookie("authToken");
  // Lo envio al Login
  res.redirect("/login");
};

const loginGithub = (req, res) => {
  res.send({ status: "success", message: "Logged in with GitHub" });
};

const loginGitHubCallback = (req, res) => {
  const user = req.user;
  logger.logger.info("user", user);

  logger.logger.debug("el usuario git", user);
  try {
    const token = generateToken(req.user);
    logger.logger.info("token", token);
    res.cookie("authToken", token, {
      maxAge: 1000 * 3600 * 24,
      httpOnly: true,
    });
    logger.logger.debug("eltokenquenuevo", user);
    // Redirect the user to the /products page
    res.redirect("/products");
  } catch (error) {
    logger.logger.error("Error creating token:", error);
    res.sendInternalError(error);
  }
};

const current = (req, res) => {
  try {
    return res.sendSuccess(req.user);
  } catch (error) {
    return res.sendInternalError(error);
  }
};

const selectRole = async (req, res) => {
  try {
    const { uid } = req.params;
    console.log("hastaa");
    const role = req.body;
    console.log("elrol", role);
    const newRole = await userService.updateUsersService(uid, role);
    console.log("elnuevorole", newRole);
    res
      .status(200)
      .json({ message: "User role updated successfully", newRole });
  } catch (error) {
    logger.logger.error("Error updating user role:", error);
    res.status(500).json({ message: "Failed to update user role", error });
  }
};

const restoreRequest = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.sendBadRequest("No se proporciono un email");
  const user = await userService.getUserByService({ email });
  if (!user) return res.sendBadRequest("Email no valido");
  //Se crea el restoreToken
  const restoreToken = generateToken(RestoreTokenDTO.getFrom(user), 3600);
  const mailingService = new MailingServices();
  const result = await mailingService.sendMail(user.email, DTemplates.RESTORE, {
    restoreToken,
  });
  res.sendSuccess("Correo enviado exitosamente");
};

const restorePassword = async (req, res) => {
  const { password, token } = req.body;
  try {
    const tokenUser = jwt.verify(token, config.tokenKey.key);
    console.log(tokenUser.email);
    const user = await userService.getUserByService({ email: tokenUser.email });
    console.log("eluser", user);
    //Verificar que la contrasenia no es la misma a la que ya tenia
    const isSamePassword = isValidPassword(password, user.password);
    console.log(isSamePassword);
    if (isSamePassword)
      res.sendBadRequest(
        "Su nueva contrasenia no puede ser igual a la anterior"
      );
    const newHashedPassword = await createHash(password);
    console.log(user._id);
    console.log(newHashedPassword);
    const updateuSER = await userService.updateUsersService(user._id, {
      password: newHashedPassword,
    });
    console.log(updateuSER);
    res.sendSuccess("Contrasenia modificada exitosamente");
  } catch (error) {
    console.log(error);
  }
};

const getUsers = async (req, res) => {
  try {
    const { uid } = req.params;
    const users = await userService.getUsersService();
    const userDTOs = users.map(user => new UserDTO(user)); 
    res.render('users', { userh: userDTOs }); 
    
  } catch (error) {
    console.error(error);
    res.status(500).send('An internal server error occurred.'); // Set status code and send error response
  }
};

const deleteUsers = async (req,res) => {
  //172,800,000 milliseconds
  //30 minutes * 60 seconds/minute * 1000 milliseconds/second = 1,800,000 milliseconds
  try {
    const dateToday = Date.now()
    console.log('lafecha',dateToday)
    const { uid } = req.params;
    const users = await userService.getUsersService();
    //console.log(users)

    const deleteUsers = [];
    users.forEach((user) => {
      if (user.last_connection || user.role != 'ADMIN') {
        // Calculate the time difference between the current date and user's last_connection
        const connectionDate = dateToday - new Date(user.last_connection); // Convert to Date object
        if (connectionDate > 1800000) {
          deleteUsers.push(user);
          logger.logger.info('Empujar al arreglo delete', deleteUsers);
        }
      }
    });
    console.log(deleteUsers)
    res.render('deleteUsers', { userh: deleteUsers }); 
    
  } catch (error) {
    console.error(error);
    res.status(500).send('An internal server error occurred.'); // Set status code and send error response
  }
}

const deleteInactiveUsers = async (req,res) => {
  const uid = req.body.idUsuario
  const email = req.body.emailUsuario
  console.log(uid)
  console.log(email)
 try {
     /* // Delete the users in the usersToDelete array
      await userService.deleteUsersService(uid);
      //Aca tengo que enviar el email al usuario*/
      const result = await transport.sendMail({
        from:'Luli Store <config.app.email>',
        to:`${email}`,
        subject:'Su cuenta ha sido eliminada',
        //Le doy el formato a mi email lo puedo guardar en un componentes
        html:`
        <div>
        <h1>Eliminacion</h1>
        <h2> Su cuenta ha sido eliminada ya que no tuvo actividad en los ultimos dos dias</h2>
        </div>`
        
     
      })
    
    res.status(200).json({ message: 'Users deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An internal server error occurred' });
  }
}



const modifyUser = async (req,res) => {

}


export default {
  register,
  login,
  logout,
  loginGithub,
  loginGitHubCallback,
  current,
  selectRole,
  restoreRequest,
  restorePassword,
  getUsers,
  deleteUsers,
  modifyUser,
  deleteInactiveUsers
};
