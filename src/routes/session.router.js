import { Router } from "express";
import passport from 'passport';

const router = Router();

router.post('/register',passport.authenticate('register',{failureRedirect:'/api/sessions/registerFail'}) , async(req,res)=>{
    res.send({status:"success", message:"Registered"})
})

router.get('/registerFail', (req,res) =>{
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
  });

  export default router;

  