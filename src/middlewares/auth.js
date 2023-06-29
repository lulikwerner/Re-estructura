export const privacy = (privacyType) => {
  return (req, res, next) => {
    // Extract the user from the 'authToken' cookie
    const user = req.session.user;



    switch (privacyType) {
  
      case 'PRIVATE':
        // If the user exists, continue to the next middleware
        if (user) {
          next();
        } else {
          // Redirect to login if the user doesn't exist
          res.redirect('/login');
        }
        break;
      case 'NO_AUTH':
        // If the user doesn't exist, continue to the next middleware
        if (!user) {
          next();
        } else {
          // Redirect to products if the user exists
          res.redirect('/products');
        }
        break;
    }
  };
};
