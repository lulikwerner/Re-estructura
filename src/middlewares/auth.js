export const privacy = (privacyType) =>{
    return(req,res,next) => {
        const {user} = req.session;
        switch(privacyType){
            case "PRIVATE": 
            //Si el usuario existe continua sino lo redirige a logearse
            if(user) next();
            else res.redirect('/login');
            break;
            case "NO_AUTHENTICATED":
                if(!user) next();
                else res.redirect('/products')
        }
    };
};