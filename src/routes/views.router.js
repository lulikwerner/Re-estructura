import { Router } from "express";
import { passportCall } from '../services/auth.js';
import BaseRouter from '../routes/Router.js'
import viewsController from '../controllers/views.controller.js';
import config from "../config.js";

import nodemailer from 'nodemailer'
import twilio from "twilio";

const router = Router();


const transport = nodemailer.createTransport({
  service:'gmail',
  port:587,
  auth:{
    user:config.app.email,
    pass:config.app.password
  }
})

const twilioClient = twilio(config.twilio.sid, config.twilio.Token)
export default class ViewsRouter extends BaseRouter {

  init() {
//Para mandar email
this.get('/mail',["USER","PUBLIC"],passportCall('jwt', { strategyType: 'jwt' }), async (req,res) => {
      const result = await transport.sendMail({
        from:'Luli Store <config.app.email>',
        to:'inforpmusa@gmail.com',
        subject:'Correo de prueba',
        //Le doy el formato a mi email lo puedo guardar en un componentes
        html:`
        <div><h1>Esto es un correo de prueba</h1></div>`
        //dentro de las bastics <img src='cid:perfilbonito'/>
        /*,
        attachments:[
          {
            filename:'Curriculum.pdf',
            path://ruta donde lo tengo guardado al file
          },
          {
            filename:'perritoDeprimido.jpg',
            path://ruta donde lo tengo guardado la foto,
            cid:'perfilbonito'
          }
        ]*/
      })
      res.send({status:'succes', payload:result})
    })
//Para mandar sms
this.get('/sms', ["USER","PUBLIC"], passportCall('jwt', { strategyType: 'jwt' }), async (req,res) => {
  const clientNumber = '+9543832654';
  const result = await twilioClient.messages.create({
    body:'SMS de prueba',
    from: config.twilio.Number,
    to:clientNumber
  })
  res.send({status:'succes', payload:result})
})
    //Dejar que solo Admin entre
//Formulario para cargar productos nuevos y muestra los productos y los puedo eliminar 
this.get('/realTimeProducts' ,["ADMIN"], passportCall('jwt', { strategyType: 'jwt' }),viewsController.realTimeProducts);

//Muestra los productos, filtro y orden
this.get('/products', ["USER","PUBLIC"],passportCall('jwt', { strategyType: 'jwt' }), viewsController.getProducts);

//Abre el chat
this.get('/chat',["USER"],viewsController.chat);

//Muestro los productos que tiene el carrito
this.get('/cart/:cid',["USER","ADMIN"],passportCall('jwt', { strategyType: 'jwt' }), viewsController.productsInCart);

this.get('/register',['NO_AUTH'], passportCall('register',{strategyType:'jwt'}), viewsController.register);

this.get('/login', ['NO_AUTH'],passportCall('login', { strategyType: 'jwt' }), viewsController.login);

this.get('/profile', ["USER","ADMIN"], passportCall('jwt', { strategyType: 'jwt' }), viewsController.profile);


}}