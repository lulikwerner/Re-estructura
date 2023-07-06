import dotenv from 'dotenv';


dotenv.config();

export default{
    app:{
        PORT:process.env.PORT||8080
    },
    adminPas:{
        adminEmail: process.env.ADMIN_EMAIL ,
        adminPassword: process.env.ADMIN_PW
    },
    tokenKey:{
        key:process.env.TOKEN_SECRET_KEY
    }
    /*privateKey: process.env.PRIVATE_KEY,
    gitHubClientId: process.env.GITHUB_CLIENT_ID,
    gitHubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    url: process.env.URL_HOST,
    callbackURL: process.env.GITHUB_CALLBACK_URL*/

}