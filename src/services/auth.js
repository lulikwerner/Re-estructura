import bcrypt from 'bcrypt';
import passport from 'passport';
import jwt from 'jsonwebtoken';

export const createHash = async (password) => {
  const salts = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salts);
}

export const isValidPassword = (password, hashedPassword) => bcrypt.compareSync(password, hashedPassword);

export const passportCall = (strategy, options = {}) => {
  return async (req, res, next) => {
    console.log('entro al passport');
    passport.authenticate(strategy, (error, user, info) => {
      if (error) return next(error);
      // Si no viene el user me quejo. Si en info me manda un mensaje muestro ese mensaje, sino lo que tira de error convertirlo a mensaje
      if (!user) return res.sendUnauthorized(info.message ? info.message : info.toString());
      req.user = user;
      next();
    })(req, res, next);
  };
}


export const generateToken = (user) => {
    return jwt.sign(user,'jwtSecret',{expiresIn:'1d'});//Este es el secreto que paso despues en passport para decifrar tl token
}