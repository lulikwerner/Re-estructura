import { Router } from "express";
import userModel from "../dao/mongo/models/user.js"

const router = Router();

router.post('/register', async(req,res)=>{
    const result = await userModel.create(req.body);
    res.send({status:"success", payload:result})
})

/*router.post('/register', async(req,res)=>{
  const{first_name, last_name, email} = req.body;
    if(!first_name||!last_name||!email) return res.status(400).send({status:"error", error: "Uno de los campos esta incompleto"});
    let user = {
      first_name,
      last_name,
      email,
      password:createHash(password)
    }
})*/
router.post('/login', async(req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email, password });
    if(email === "adminCoder@coder.com" && password==="adminCod3r123" ){
      //Aca inicializo el admin
      req.session.user = {
        name: `Admin`,
        role: 'admin',
        email: '...'
      }
      console.log('Logged in user:', req.session.user); 
      return res.status(200).json({ status: "success" });
    }
    if (!user) {
      return res.status(401).json({ status: "error", error: "Usuario o contraseña incorrecta" });
    }
  
    // If the user and password are valid
    req.session.user = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      role: user.role
    };
    console.log('Logged in user:', req.session.user); 
    return res.status(200).json({ status: "success" });
  }); 

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

  