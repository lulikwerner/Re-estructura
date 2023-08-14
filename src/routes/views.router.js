import { Router } from 'express';
import { passportCall } from '../services/auth.js';
import BaseRouter from '../routes/Router.js'
import viewsController from '../controllers/views.controller.js';
import config from '../config.js';
import modifyProducts from '../middlewares/modifyProducts.js';


const router = Router();


export default class ViewsRouter extends BaseRouter {

  init() {
//Para mandar email
this.get('/mail',['USER','PUBLIC'],passportCall('jwt', { strategyType: 'jwt' }), viewsController.mail);

//Para mandar sms
this.get('/sms', ['USER','PUBLIC'], passportCall('jwt', { strategyType: 'jwt' }), viewsController.sms)

//Formulario para cargar productos nuevos y muestra los productos y los puedo eliminar 
this.get('/realTimeProducts' ,['ADMIN','PREMIUM'], passportCall('jwt', { strategyType: 'jwt' }),viewsController.realTimeProducts);

//Muestra los productos, filtro y ordeno
this.get('/products', ['USER','PUBLIC','PREMIUM','user'],passportCall('jwt', { strategyType: 'jwt' }), viewsController.getProducts);

//Abre el chat
this.get('/chat',['USER','PREMIUM'],viewsController.chat);

//Muestro los productos que tiene el carrito
this.get('/cart/:cid',['USER','ADMIN','PREMIUM'],passportCall('jwt', { strategyType: 'jwt' }), viewsController.productsInCart);

this.get('/register',['NO_AUTH'], passportCall('register',{strategyType:'jwt'}), viewsController.register);

this.get('/login', ['NO_AUTH'],passportCall('login', { strategyType: 'jwt' }), viewsController.login);

this.get('/profile', ['USER','ADMIN','PREMIUM'], passportCall('jwt', { strategyType: 'jwt' }), viewsController.profile);


}}