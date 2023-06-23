import express from "express";
import session from "express-session"
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import MongoStore from "connect-mongo"
import cookieParser from 'cookie-parser';
import { Server } from "socket.io";
import { __dirname } from "./utils.js";
import passport from "passport";


import productRouter from "./routes/productsM.router.js";
import cartRouter from "./routes/cartsM.router.js";
import viewsRouter from "./routes/views.router.js";
import SessionRouter from "./routes/session.router.js"


import registerChatHandler from "./listeners/chatHandler.js";
import cartSocket from "./sockets/cart.sockets.js";
import productSocket from "./sockets/product.sockets.js";
import initlizePassportStrategies from './config/passport.config.js'

const app = express();
const PORT = process.env.PORT || 8080;

const startServer = async () => {
  //Conecta a mi mongoose db
  try {
    await mongoose.connect(
      "mongodb+srv://lulikwerner:123@clustercitofeliz.ro8b1xi.mongodb.net/ecommerce?retryWrites=true&w=majority"
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }

 

  //Conecto a mi puerto
  const server = app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
  });
  const io = new Server(server);

  app.engine("handlebars", handlebars.engine());
  app.set("views", `${__dirname}/views`);
  app.set("view engine", "handlebars");

  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(`${__dirname}/public`));

  app.use(session({
    store:new MongoStore({
      mongoUrl: "mongodb+srv://lulikwerner:123@clustercitofeliz.ro8b1xi.mongodb.net/ecommerce?retryWrites=true&w=majority",
      ttl:3600
    }),
    secret:"CoderS3cr3t",
    resave:false,
    saveUninitialized:false 
  }))

  const ioMiddleware = (req, res, next) => {
    req.io = io;
    next();
  };
  app.use(ioMiddleware);

  app.use(passport.initialize());
  initlizePassportStrategies();



  //Son las rutas que uso
  app.use("/api/products", productRouter);
  app.use("/", viewsRouter);
  app.use("/api/carts", cartRouter);
  const sessionRouter = new SessionRouter();
  app.use("/api/sessions", sessionRouter.getRouter());
  //El chat 
  io.on("connection", async (socket) => {
    registerChatHandler(io, socket);

    console.log("Socket connected");
  });

  //Llama al ProductSocket y al cartSocket
  productSocket(io);
  cartSocket(io);
};

startServer();
