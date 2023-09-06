import {privacy} from "../middlewares/auth.js"
import BaseRouter from "./Router.js";
import {passportCall } from '../services/auth.js';
import usersController from '../controllers/users.controller.js';
import uploader from "../middlewares/uploader.js";


export default class SessionsRouter extends BaseRouter{
  init(){
    console.log('entro al init')

    this.post('/register',['NO_AUTH'], passportCall('register',{strategyType:'locals'}),usersController.register);

    this.post('/login', ['NO_AUTH'],passportCall('login', { strategyType: 'locals' }), usersController.login);
    
    this.post('/logout', ['PRIVATE'], usersController.logout);

    this.get('/githubcallback', ['NO_AUTH'], passportCall('github', { strategyType: 'locals' }), usersController.loginGitHubCallback);

    this.get('/github', ['NO_AUTH'], passportCall('github', { strategyType: 'locals' }), usersController.loginGithub);

    this.get('/current', ['PRIVATE'], passportCall('jwt', { strategyType: "locals" }), usersController.current);

    //Modifico la informacion del cliente de acuerdo a lo que seleccione
    this.put('/premium/:uid',['PRIVATE'], passportCall('jwt', { strategyType: "locals" }),usersController.selectRole);

    this.post('/premium/:uid/documents', ['PRIVATE'], passportCall('jwt',{ strategyType: "jwt"}), uploader.any(), usersController.uploadDocuments)

    this.post('/restoreRequest',['NO_AUTH'], passportCall('jwt', { strategyType: "jwt" }), usersController.restoreRequest);

    this.post('/restorePassword', ['PUBLIC'], passportCall('jwt', { strategyType: "jwt" }), usersController.restorePassword);

    this.get('/', ['ADMIN'],passportCall('jwt', { strategyType: "jwt" }), usersController.getUsers);  
    
    this.get('/delete',['ADMIN'], passportCall('jwt', { strategyType: 'jwt' }), usersController.deleteUsers);

    this.delete('/delete',['ADMIN'],passportCall('jwt', { strategyType: "jwt" }), usersController.deleteInactiveUsers);

    this.post ('/search/:uid', ['ADMIN'],passportCall('jwt', { strategyType: "jwt" }), usersController.modifyUser );

    this.delete('/search/:uid/delete', ['ADMIN'],passportCall('jwt', { strategyType: "jwt" }), usersController.deleteuS)
  }
}












  