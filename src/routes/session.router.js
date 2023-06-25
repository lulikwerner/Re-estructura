import passport from 'passport';
import BaseRouter from "./Router.js";
import { generateToken, passportCall } from '../services/auth.js';


export default class SessionsRouter extends BaseRouter{
  init(){
    console.log('entro al init')

    this.post('/register',['NO_AUTH'], passportCall('register',{strategyType:'locals'}),(req,res) => {
      console.log('estamos en register')
      res.sendSuccess()
    })

    this.post('/login',['NO_AUTH'], passportCall('login', { strategyType: 'locals' }), (req, res) => {
      // El login recibe SIEMPRE en req.user
      const token = generateToken(req.user);
      res.cookie('authToken', token, {
        maxAge: 1000 * 3600 * 24,
        httpOnly: true
      });
      // Send the response with user information
      res.sendSuccessWithPayload({ user: req.user });
    });
    
    //Revisar
    this.post('/logout', ['PRIVATE'], (req, res, next) => {
      // Clear the auth token cookie
      res.clearCookie('authToken');
      // Redirect to the login page or send a success response
      res.redirect('/login');
    });
    

//revisar    
this.get('/github', ['NO_AUTH'], passportCall('github', { strategyType: 'locals' }), (req, res) => {
  res.send({ status: "success", message: "Logged in with GitHub" });
});

this.get('/githubcallback', ['NO_AUTH'], passportCall('github', { strategyType: 'locals' }), (req, res) => {
  const user = req.user;
  console.log('el usuario goit', user);
  try {
    const token = generateToken(req.user);
    console.log('token', token);
    res.cookie('authToken', token, {
      maxAge: 1000 * 3600 * 24,
      httpOnly: true
    });
    console.log('eltokenquenevio',user)
    // Redirect the user to the /products page
    res.redirect('/products');

  } catch (error) {
    console.error('Error creating token:', error);
    res.status(500).send({ status: "error", error });
  }
});

  }
}












  