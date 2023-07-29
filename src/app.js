import express from "express";
import session from "express-session"
import handlebars from "express-handlebars";
import MongoStore from "connect-mongo"
import cookieParser from 'cookie-parser';
import { Server } from "socket.io";
import { __dirname } from "./utils.js";
import passport from "passport";
import config from './config.js'
import nodemailer from 'nodemailer'
import winston from 'winston'


import ProductRouter from "./routes/productsM.router.js";
import CartRouter from "./routes/cartsM.router.js";
import ViewsRouter from "./routes/views.router.js";
import SessionRouter from "./routes/session.router.js"

import registerChatHandler from "./listeners/chatHandler.js";
import cartSocket from "./sockets/cart.sockets.js";
import productSocket from "./sockets/product.sockets.js";
import initlizePassportStrategies from './config/passport.config.js'
import errorHandler from './middlewares/error.js'
import attachLogger from "./middlewares/logger.js";
import LoggerService from  '../src/services/LoggerService.js'


const app = express();
const PORT = config.app.PORT;
const logger = new LoggerService(config.logger.type); 




const startServer = async (persistenceType) => {

 const transport = nodemailer.createTransport({
  service:'gmail',
  port:587,
  auth:{
    user:config.app.email,
    pass:config.app.password
  }
})

  //Conecta a mi mongoose db
/*try {
    await mongoose.connect(
      config.mongoSecret.MongoURL
    );
   logger.logger.info("Connected to MongoDB");
  } catch (error) {
    logger.logger.error("Failed to connect to MongoDB:", error);
  }*/

 

  //Conecto a mi puerto
  const server = app.listen(PORT, () => {
    //logger.logger.info();
    console.log(`Listening on ${PORT}`)
  });
  const io = new Server(server);


  app.engine("handlebars", handlebars.engine());
  app.set("views", `${__dirname}/views`);
  app.set("view engine", "handlebars");


  app.use(passport.initialize());
  initlizePassportStrategies();

  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(`${__dirname}/public`));

  app.use(session({
    store:new MongoStore({
      mongoUrl: config.mongoSecret.MongoURL,
      ttl:3600
    }),
    secret:config.mongoSecret.secret,
    resave:false,
    saveUninitialized:false 
  }))

  const ioMiddleware = (req, res, next) => {
    req.io = io;
    next();
  };
  app.use(ioMiddleware);


app.use(attachLogger)




app.get('/loggerTest', (req, res) => {
  logger.logger.error("127.0.0.1 - there's no place like home");
  logger.logger.warning("127.0.0.1 - there's no place like home");
  logger.logger.http("127.0.0.1 - there's no place like home");
  logger.logger.info("127.0.0.1 - there's no place like home");
  logger.logger.debug("127.0.0.1 - there's no place like home");

  res.sendStatus(200);
});



  const viewsRouter = new ViewsRouter()
  const sessionRouter = new SessionRouter();
  const cartRouter = new CartRouter();
  const productRouter = new ProductRouter();
  //Son las rutas que uso
  app.use("/api/products", productRouter.getRouter());
  app.use('/', viewsRouter.getRouter());
  app.use("/api/carts", cartRouter.getRouter());
  app.use("/api/sessions", sessionRouter.getRouter());
  
//El ErrorHandler va despues de mis rutas
  app.use(errorHandler)
  //El chat 
  io.on("connection", async (socket) => {
    registerChatHandler(io, socket);
    logger.logger.info('Socket connected');
  });

  //Llama al ProductSocket y al cartSocket
  productSocket(io);
  cartSocket(io);
};

export default startServer;
