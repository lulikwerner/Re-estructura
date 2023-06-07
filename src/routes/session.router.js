import { Router } from "express";
import userModel from "../dao/mongo/models/user.js"
import { createHash, isValidPassword } from "../utils.js";

const router = Router();

router.post('/register', async(req,res)=>{
  const { first_name, last_name, email, password } = req.body;
  //Corroboro que completen todos los campos de registro
if(!first_name || !last_name || !email || !password){
    return res.status(401).json({ status: 'error', error: 'Por favor completar todos los campos' });
  } 
  //Busco si ya existe el usuario
  const exists = await userModel.findOne({email});
  if(exists)return res.status(400).send({status:"error", error:"El usuario ya existe"});
  //Si no existe el usuario en la db. Encripto la contrasenia
  const hashedPassword = await createHash(password);
  //Construyo el usuario que voy a registrar
  const user = {
    first_name,
    last_name,  
    email,
    password:hashedPassword
  }
    const result = await userModel.create(user);
    res.send({status:"success", payload:result})
})

router.post('/login', async(req, res) => {  
    const { email, password } = req.body;
    const user = await userModel.findOne({email}); //Solo busco por email
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
      return res.status(401).json({ status: "error", error: "Credenciales incorrectas" });
    }
  
    // Si el usuario existe valido el pw
    const isPasswordValid   = await isValidPassword(password,user.password);
    console.log(password)
    console.log(user.password)
    if(!isPasswordValid ) return res.status(400).send({status:"error", error:"contrasenia incorrecta"});

    //Si el usuario existe y la contrasenia es correcta entonces creo su sesion
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

  