
import { CartDAO, ProductDAO } from '../dao/factory.js';
import CartRepository from './repositories/cart.service.js'
import ProductRepository from './repositories/product.service.js';

import UserManager from '../dao/mongo/managers/usersManager.js';
import UserRepository from './repositories/user.service.js';

//Como uso el Factory para Carts y Products los traigo asi
export const cartService = new CartRepository(CartDAO);
export const productService = new ProductRepository(ProductDAO);
//Como directamente importo el manager de users lo tengo que instanciar
export const userService = new UserRepository (new UserManager());

/*Es la forma de hacerlo si no uso un Factory y directamente traigo el manager desde el dao */
//import CartManager from '../dao/mongo/managers/cartManager.js';
//import ProductManager from '../dao/mongo/managers/productManager.js';
//export const cartService = new CartRepository(new CartManager());
//export const productService = new ProductRepository(new ProductManager());
