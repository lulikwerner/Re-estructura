import CartManager from '../dao/mongo/managers/cartManager.js';
//import PersistenceFactory from '../dao/factory.js';
import CartRepository from './cart.service.js'

import ProductManager from '../dao/mongo/managers/productManager.js';
import ProductRepository from './product.service.js';

import UserManager from '../dao/mongo/managers/usersManager.js';
import UserRepository from '../services/user.service.js';


//export const cartService = new CartService(PersistenceFactory.getPersistence());
export const cartService = new CartRepository(new CartManager());
export const productService = new ProductRepository(new ProductManager());
export const userService = new UserRepository (new UserManager());