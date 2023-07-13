import { generateToken } from '../services/auth.js';
import TokenDTO from '../dto/user/TokenDto.js';

const register = (req,res) => {
    console.log('estamos en register')
    res.sendSuccess()
  };

  const login = (req, res) => {
    // El login recibe SIEMPRE en req.user
    const token = generateToken(req.user);
    res.cookie('authToken', token, {
      maxAge: 1000 * 3600 * 24,
      httpOnly: true
    });
    // Send the response with user information
    res.sendSuccessWithPayload({ user: req.user });
  };

  const logout = (req, res, next) => {
    // Clear the auth token cookie
    res.clearCookie('authToken');
    // Redirect to the login page or send a success response
    res.redirect('/login');
  };

  const loginGithub = (req, res) => {
    res.send({ status: "success", message: "Logged in with GitHub" });
  };

  const loginGitHubCallback = (req, res) => {
    const user = req.user;
    console.log('el usuario git', user);
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
      res.sendInternalError (error);
    }
  };
  
  const current = (req, res) => {
    try {
      const user = new TokenDTO(req.user) || new AdminDTO(req.user);
      return res.status(200).json({
        status: 'success',
        data: {
          user: user
        }
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        error: error
      });
    }
  };

  export default{
    register,
    login,
    logout,
    loginGithub,
    loginGitHubCallback,
    current,
  }