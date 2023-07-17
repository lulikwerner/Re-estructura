import { productsM, cartsM, usersServices} from '../dao/mongo/managers/index.js';
import { cookieExtractor } from '../utils.js';
import jwt from 'jsonwebtoken';
import config from '../config.js';


export default function socketCarts(io) {
  io.on("connection", async (socket) => {
    console.log('Cart conexion');
    const headers = socket.handshake.headers;
    socket.on('addedProduct', async (data) => {
      const productId = data; 
      console.log('Product ID:', productId);
    

      const productToAdd = await productsM.getProductBy({ _id: productId });
      console.log('Product to add:', productToAdd);
      const productsArray = Object.values(productToAdd); // Convert the object to an array
      console.log('el produ a agregar',productsArray)

      const cookie = headers['cookie'];
      const token = cookieExtractor({ headers: { cookie } });


      if (token) {
        console.log('entro al request')
        console.log(token)
        try {
          const payload = jwt.verify(token, config.tokenKey.key);
          console.log('Decoded payload:', payload);
          //El payload.id es como viene cuando es un usuario de DB y el payload._id es cuando me logeo desde github
          const userId = payload.id||payload._id;
          const cartUser=payload.cart;
         //console.log('el cart que viene con el usuario',payload.cart)
          const user = await usersServices.getUserBy({ _id: userId });
          //Busco el cart
          const cart = await cartsM.getCartById(cartUser);
           console.log(JSON.stringify(cart, null, '\t'));
           if (cart){
          //Si el producto esta en el cart llamo al  updateQtyCart
          const foundProduct = cart.products.find((product) => product.product._id.toString() === productId);
 
            const updatedCart = await cartsM. updateQtyCart(cartUser, productToAdd, 1);
            console.log('carrito updated',updatedCart )
           }
           else {
            // Create a new cart and associate it with the user
            const newCart = await cartsM.createCart(productsArray);
            console.log('New Cart created:', newCart);
            // Update the user's cart field with the new cart ID
            await usersServices.updateUsers ({ _id: userId }, { cart: newCart._id });
            console.log('User cart updated');
          }
      
  
        } catch (error) {
          console.log('Error decoding token:', error);
        }
      } else {
        console.log('The user is not logged in');
      }
    });
  });
}
