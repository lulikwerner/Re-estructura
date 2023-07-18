import passport from "passport";
import local from "passport-local";
import {Strategy, ExtractJwt} from 'passport-jwt';
import { usersServices } from '../dao/mongo/managers/index.js';



import GithubStrategy from "passport-github2";
import { createHash, isValidPassword } from "../services/auth.js";
import { cookieExtractor } from "../utils.js";
import config from '../config.js';
import TokenDTO from '../dto/user/TokenDto.js';
import AdminDTO from '../dto/user/AdminDto.js'


const LocalStrategy = local.Strategy; //Es la estrategia
const JWTStrategy = Strategy;

const initlizePassportStrategies = () => {
  console.log('entro al initialized')

//username y password son obligatorios extraerlos por eso te lo pide. Pongo el valor en true passReqToCallback: true para que me deje extraer la otra info del user y le digo que el email va a ser el username field usernameField:'email' 
passport.use('register',new LocalStrategy({passReqToCallback: true, usernameField:'email'}, async(req,email,password,done) => {     
  try{
        //Aca extraigo todo lo que quiero que no sea username y password
        const { first_name, last_name, age, role } = req.body;
        //Corroboro que completen todos los campos de registro
      if(!first_name || !last_name || !age || !email || !password){
          return done(null,false, { message: 'Por favor completar todos los campos' });
        } 
        if(isNaN(age) || age<0){done(null,false,{message:'Ingrese una edad valida'})}
        //Busco si ya existe el usuario
        const exists = await usersServices.getUserBy({email});
        if(exists) {done(null,false,{message:'El usuario ya existe'})}
        //Si no existe el usuario en la db. Encripto la contrasenia
        else{
          const hashedPassword = await createHash(password);

        //Construyo el usuario que voy a registrar
        const newUser = {
          first_name,
          last_name,
          age, 
          role,
          email,
          password:hashedPassword
        }
          const result = await usersServices.createUsers(newUser);
          console.log('el resultado es',result)
          //Si todo salio ok,
          done(null,result);}
        }catch(error){
            done(error) 
        }
}))

//le digo que el email va a ser el field username
passport.use('login', new LocalStrategy({usernameField:'email'},async(email, password,done)=>{
    //PASSPORT SOLO DEBE DEVOLVER EL USUARIO FINAL. NO ES RESPONSABLE DE LA SESION
    console.log('en el login')
    let user;
    try{
    if(email === config.adminPas.adminEmail  && password=== config.adminPas.adminPassword   ){
      //Aca inicializo el admin
      user =  new AdminDTO(user)
      console.log('user admin', user)
      return done(null, user);
      
    }
    user = await usersServices.getUserBy ({email}); //Solo busco por email
    if (!user) return done(null,false,{message: "Credenciales incorrectas" });
    // Si el usuario existe valido el pw
    const isPasswordValid   = await isValidPassword(password,user.password);
    console.log(password)
    console.log(user.password)
    if(!isPasswordValid ) return done(null,false,{message:"contrasenia incorrecta"});
    //Si el usuario existe y la contrasenia es correcta entonces devuelvo la sesion en passport
    user = new TokenDTO(user)
    //Cuando no usaba el dto
    /*user = {
        id:user._id,  
        first_name: user.first_name,
        last_name: user.last_name,
        age:user.age,
        cart: user.cart, //aca me tiene que traer el id del cart
        email: user.email,
        role: user.role
    };*/
    return done(null,user);

  }catch(error){
    return done(error);
  }
}));

passport.use('github', new GithubStrategy({
  clientID:config.gitHub.ClientId,
  clientSecret:config.gitHub.Secret,
  callbackURL:config.gitHub.callbackURL
}, async(accessToken, refreshToken, profile, done )=>{
    try{
      console.log('el perfil',profile);
      //Tomo los datos que me sirven
      const{name,email} = profile._json;
      const user = await usersServices.getUserBy ({email});
      if(!user){
        //Si el usuario no existe lo creo yo
        const newUser = {
          first_name: name,
          email,
          age:23,
          password:'',
        }
        //Creo el nuevo usuario
        const result = await usersServices.createUsers(newUser);
        done(null,result)
      }
      //Si el usuario ya existia
      done(null,user);
    }catch(error){
      done(error);
    }
}))

passport.use('jwt', new JWTStrategy({
  jwtFromRequest: cookieExtractor,
  secretOrKey: config.tokenKey.key
}, async (payload, done) => {
  //Busco por id el user y lo retorno
  try {
    const userId = payload.id || payload._id;
    const user = await usersServices.getUserBy({ _id: userId });
    if (user) {
      console.log('User found:', user); 
      return done(null, user);
    } 
    //Si el id es 0 entonces es admin y devuelvo el admin
     if(payload.id===0 || payload._id===0){
      console.log('Admin user detected'); 
      const adminUser = new AdminDTO(user)
      return done(null, adminUser);
    }else {
      console.log('User not found'); 
      return done(null, false);
    }
  } catch (error) {
    console.error('Error fetching user:', error); 
    return done(error);
  }
}
)
);
};
export default initlizePassportStrategies;