import { generateToken } from '../services/auth.js';

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
    //console.log('holagit')
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
      console.log('eltokenquenuevo',user)
      // Redirect the user to the /products page
      res.redirect('/products');

    } catch (error) {
      console.error('Error creating token:', error);
      res.sendInternalError (error);
    }
  };

  
  
  const current = (req, res) => {
    try {
        return res.sendSuccess(req.user);

    } catch (error) {
        return res.sendInternalError(error);
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