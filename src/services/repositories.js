
import { createCartDAO, createProductDAO , createCheckoutDAO } from '../dao/factory.js';
import CartRepository from './repositories/cart.service.js'
import ProductRepository from './repositories/product.service.js';
import CheckoutRepository from './repositories/checkout.service.js';

import UserManager from '../dao/mongo/managers/usersManager.js';
import UserRepository from './repositories/user.service.js';

/*Es la forma de hacerlo si no uso un Factory y directamente traigo el manager desde el dao */
//import CartManager from '../dao/mongo/managers/cartManager.js';
//import ProductManager from '../dao/mongo/managers/productManager.js';
//import CheckoutManager from '../dao/mongo/managers/checkoutManager.js';

//export const cartService = new CartRepository(new CartManager());
//export const productService = new ProductRepository(new ProductManager());
//export const checkoutService = new CheckoutRepository (new CheckoutManager());


//Como uso el Factory para Carts y Products los traigo asi
const persistenceType = 'MONG0'?'MONGO':'FILESYSTEM'
export const cartService =  new CartRepository(await createCartDAO(persistenceType)); 
export const productService = new ProductRepository(await createProductDAO(persistenceType));
export const checkoutService = new CheckoutRepository (await createCheckoutDAO(persistenceType));

//Como directamente importo el manager de users lo tengo que instanciar
export const userService = new UserRepository (new UserManager());







