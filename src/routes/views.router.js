import { Router } from "express";
import { passportCall } from '../services/auth.js';
import BaseRouter from '../routes/Router.js'
import viewsController from '../controllers/views.controller.js';

const router = Router();

export default class ViewsRouter extends BaseRouter {

  init() {
    //Dejar que solo Admin entre
//Formulario para cargar productos nuevos y muestra los productos y los puedo eliminar 
this.get('/realTimeProducts' ,["ADMIN"], passportCall('jwt', { strategyType: 'jwt' }),viewsController.realTimeProducts);

//Muestra los productos, filtro y orden
this.get('/products', ["PUBLIC"],passportCall('jwt', { strategyType: 'jwt' }), viewsController.getProducts);

//Abre el chat
this.get('/chat',["USER"],viewsController.chat);

//Muestro los productos que tiene el carrito
this.get('/cart/:cid',["USER","ADMIN"],passportCall('jwt', { strategyType: 'jwt' }), viewsController.productsInCart);

this.get('/register',['NO_AUTH'], passportCall('register',{strategyType:'jwt'}), viewsController.register);

this.get('/login', ['NO_AUTH'],passportCall('login', { strategyType: 'jwt' }), viewsController.login);

this.get('/profile', ["USER","ADMIN"], passportCall('jwt', { strategyType: 'jwt' }), viewsController.profile);

}}