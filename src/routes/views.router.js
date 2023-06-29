import { Router } from "express";
import {privacy} from "../middlewares/auth.js"
import { productsM, cartsM } from '../dao/mongo/managers/index.js'
import productModel from "../dao/mongo/models/products.js";
import categoriesAndStatus from "../dao/mongo/managers/productManager.js"
import { passportCall } from '../services/auth.js';
import BaseRouter from '../routes/Router.js'


const router = Router();

export default class ViewsRouter extends BaseRouter {

  init() {
    //Dejar que solo Admin entre
//Formulario para cargar productos nuevos y muestra los productos y los puedo eliminar 
this.get('/realTimeProducts' ,["ADMIN"], passportCall('jwt', { strategyType: 'jwt' }),async (req, res) => {
  const products = await productsM.getProducts();
  res.render('realTimeProducts', { producth: products });
});

//Muestra los productos, filtro y orden
this.get('/products', ["PUBLIC"],passportCall('jwt', { strategyType: 'jwt' }), async (req, res) => {
  const { limit, page = 1, sort, category } = req.query;

  try {
  const user = req.user;
    console.log('en la ruta', user)
    if (limit) {
      const products = await productsM.getProducts();

      if (limit < 0 || isNaN(limit)) {
        return res.sendBadRequest('Please enter a valid value for limit.' );
      }
      const limitedProducts = products.slice(0, limit); 
      return res.render('home', { producth: limitedProducts, user: user });
    }

    if (page) {
      const query = category ? { category } : {};
      const sortQuery = sort === 'desc' ? { price: -1 } : { price: 1 };
      const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, ...rest } = await productModel.paginate(query, { page, limit: 10, sort: sortQuery, lean: true });
      const producth = docs;
      const response = {
        status: 'success',
        payload: docs,
        totalPages: rest.totalPages,
        prevPage: prevPage,
        nextPage: nextPage,
        page: rest.page,
        hasPrevPage: hasPrevPage,
        hasNextPage: hasNextPage,
        prevLink: hasPrevPage ? `/?limit=${limit}&page=${prevPage}&sort=${sort}&category=${category}` : null,
        nextLink: hasNextPage ? `/?limit=${limit}&page=${nextPage}&sort=${sort}&category=${category}` : null
      };
      console.log(response);
      return res.render('home', { producth, hasPrevPage, hasNextPage, prevPage, nextPage, ...rest, user: user});
    }

    const products = await productsM.getProducts();
    const { categories, statuses } = await categoriesAndStatus();
    console.log('entro en categoria'); // Retrieve categories and statuses
    console.log('el usuario', user);
    return res.render('home', { producth: products, categories, statuses, user: user });
  } catch (error) {
    console.error(error);
    return res.sendInternalError ('An internal server error occurred.' );
  }
});

//Abre el chat
this.get('/chat',["PUBLIC"],async(req,res)=>{
  res.render('chat');
})

//Muestro los productos que tiene el carrito
this.get('/cart/:cid',["USER","ADMIN"],passportCall('jwt', { strategyType: 'jwt' }), async(req,res)=>{
  const { cid } = req.params;
  const carts = await cartsM.getCartBy(cid);
  console.log(JSON.stringify(carts, null, '\t'));
  res.render('cart',{carth:carts} );
})

this.get('/register',['NO_AUTH'], passportCall('register',{strategyType:'jwt'}), async(req,res)=>{
  res.render('register');
})

this.get('/login', ['NO_AUTH'],passportCall('login', { strategyType: 'jwt' }),  async(req,res)=>{
  res.render('login');
})

this.get('/profile', ["USER","ADMIN"], passportCall('jwt', { strategyType: 'jwt' }), (req,res) => {
  const user = req.user;
  res.render('profile', {user} )
})
}}