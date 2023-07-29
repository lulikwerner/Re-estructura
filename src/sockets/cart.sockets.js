import { productsM, cartsM, usersServices} from '../dao/mongo/managers/index.js';
import { cookieExtractor } from '../utils.js';
import jwt from 'jsonwebtoken';
import config from '../config.js';
import LoggerService from '../services/LoggerService.js';

const logger = new LoggerService(config.logger.type); 

export default function socketCarts(io) {
  io.on("connection", async (socket) => {
    logger.logger.debug('Cart conexion');
    const headers = socket.handshake.headers;
    socket.on('addedProduct', async (data) => {
      const productId = data; 
      logger.logger.info('Product ID:', productId);

      const productToAdd = await productsM.getProductBy({ _id: productId });
      logger.logger.info('Product to add:', productToAdd);
      const productsArray = Object.values(productToAdd); // Convert the object to an array
      logger.logger.info('el produ a agregar',productsArray);

      const cookie = headers['cookie'];
      const token = cookieExtractor({ headers: { cookie } });


      if (token) {
        logger.logger.debug('entro al request');
        logger.logger.info(token);
        try {
          const payload = jwt.verify(token, config.tokenKey.key);
          logger.logger.info('Decoded payload:', payload);
          //El payload.id es como viene cuando es un usuario de DB y el payload._id es cuando me logeo desde github
          const userId = payload.id||payload._id;
          const cartUser=payload.cart;
          //logger.logger.info('el cart que viene con el usuario',payload.cart);
          const user = await usersServices.getUserBy({ _id: userId });
          //Busco el cart
          const cart = await cartsM.getCartById(cartUser);
          logger.logger.info(JSON.stringify(cart, null, '\t'));
           if (cart){
          //Si el producto esta en el cart llamo al  updateQtyCart
          const foundProduct = cart.products.find((product) => product.product._id.toString() === productId);
 
            const updatedCart = await cartsM. updateQtyCart(cartUser, productToAdd, 1);
            logger.logger.info('carrito updated',updatedCart);
           }
           else {
            // Create a new cart and associate it with the user
            const newCart = await cartsM.createCart(productsArray);
            logger.logger.info('New Cart created:', newCart);
            // Update the user's cart field with the new cart ID
            await usersServices.updateUsers ({ _id: userId }, { cart: newCart._id });
            logger.logger.debug('User cart updated');
          }
      
  
        } catch (error) {
          logger.logger.error('Error decoding token:', error);
        }
      } else {
        logger.logger.debug('The user is not logged in');
      }
    });
  });
}
