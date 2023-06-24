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

    this.post('/login',['ADMIN'],passportCall('login',{strategyType:'locals'}), (req,res) => {
      //El login recibe SIEMPRE en req.user
      const token = generateToken(req.user);
      res.cookie('authToken',token,{
        maxAge:1000*3600*24,
        httpOnly:true
      })
      res.sendSuccess('Logeado')
    })
  }
}



/*router.get('/registerFail', (req,res) =>{
  console.log(req.session.messages);
  res.status(400).send({status:"error", error:req.session.messages});
})

router.post('/login',passport.authenticate('login', {failureRedirect:'/api/sessions/loginFail'}), async(req, res) => {  
  req.session.user = {
    name: req.user.name,
    role: req.user.role,
    id: req.user.id,
    email: req.user.email
  }
  console.log('Logged in user:', req.user); 
  return res.status(200).json({ status: "success" });
 
  }); 

router.get('/loginFail', (req,res) => {
  console.log(req.session.messages);
  res.status(400).send({status:"error", error:req.session.messages})
})

router.get('/github', passport.authenticate('github'), (req,res) => {})
router.get('/githubcallback', passport.authenticate('github'), (req,res) => {
  const user = req.user;
  //Aqui creo la sesion
  req.session.user = {
    id: user.id,
    name: user.first_name,
    role: user.role
  }
  console.log('user:', user);
  console.log('el username', user.name)
  console.log('el id', user.id)
  console.log('el rol', user.role)
  res.send({status:"succes", message:"Logeado con gitHub"});
})

router.post('/logout', (req, res) => {
    // Destruye la sesion de la cookie
    req.session.destroy(err => {
      if (err) {
        console.error('Error destroying session:', err);
      }
      // Redirigo al Login
      res.redirect('/login');
    });
  });*/



  