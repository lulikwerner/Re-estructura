import { productsM, cartsM, usersServices } from '../dao/mongo/managers/index.js';
import { cookieExtractor } from '../utils.js';
import jwt from 'jsonwebtoken';
import config from'../config.js'


export default function socketCarts(io) {
  io.on("connection", async (socket) => {
    console.log('Cart conexion');
    
    socket.on('addedProduct', async (data) => {
      const productId = data; 
      console.log('Product ID:', productId);
    

      const productToAdd = await productsM.getProductBy({ _id: productId });
      console.log('Product to add:', productToAdd);
      const productsArray = Object.values(productToAdd); // Convert the object to an array
      console.log('el produ a agregar',productsArray)
      const token = cookieExtractor(socket.request);

      if (token) {
        try {
          const payload = jwt.verify(token, config.tokenKey.key);
          const userId = payload.id;
          const cartUser=payload.cart;
          console.log('el cart que viene con el usuario',payload.cart)
          console.log('User ID:', userId);
          const user = await usersServices.getUserBy({ _id: userId });
          // Check if the user has a cart
          if (user && user.cart) {
            const cart = await cartsM.getCartBy(cartUser);  
            console.log('mi cart',cart)
            const stock = productToAdd.stock-1;
            console.log('nuevito stock',stock)
            if (cart&&stock>0) {
              // Push the product to the existing cart
              const updatedCart = await cartsM.updateCart([productToAdd], cart);
              console.log('Cart updated:', updatedCart);
              
              const newProductStop = await productsM.updateProduct(productId,{$set:stock});
             console.log('mi nuevo',newProductStop)
            }
          } else {
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
