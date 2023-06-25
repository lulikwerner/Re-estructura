import bcrypt from 'bcrypt';
import passport from 'passport';
import jwt from 'jsonwebtoken';

export const createHash = async (password) => {
  const salts = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salts);
}

export const isValidPassword = (password, hashedPassword) => bcrypt.compareSync(password, hashedPassword);

export const passportCall = (strategy, options = {}) => {//En el option mando si hace un redirect o no 
  return async (req, res, next) => {
    console.log('entro al passport');
    passport.authenticate(strategy, (error, user, info) => {
      if (error) return next(error);
      if(!options.strategyType){
        console.log(`La ruta ${req.url} No tiene definida un tipo de estrategia`)
        return res.sendServerError
      }
      // Si no viene el user me quejo. Si en info me manda un mensaje muestro ese mensaje, sino lo que tira de error convertirlo a mensaje
      if (!user){
        switch(options.strategyType){
            //Si no encuentro un user en jwt significa que no estoy logeado asi que le digo que continue
            case 'jwt':
                req.error = info.message?info.message:info.toString;
                //Tengo que agregar para redirigir al login 
                return next();
                //Si no encuentro un user en locals significa un problema de login o registro. Entonces si quejate
            case 'locals':
              console.log('el tema es locals')
                return res.sendUnauthorized(info.message ? info.message : info.toString());
        }
      } 
      req.user = user;
      console.log(user)
      next();
    })(req, res, next);
  };
}

export const generateToken = (user) => {
    return jwt.sign(user,'jwtSecret',{expiresIn:'1d'});//Este es el secreto que paso despues en passport para decifrar tl token
}