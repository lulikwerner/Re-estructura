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
    },
    mongoSecret:{
        secret:process.env.MONGO_SECRET
    },
    gitHub:{
        ClientId: process.env.CLIENT_ID,
        Secret:process.env.CLIENT_SECRET,
        callbackURL:process.env.CLIENT_URL
    }
}