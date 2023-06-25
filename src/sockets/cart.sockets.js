import { productsM, cartsM , usersServices} from '../dao/mongo/managers/index.js'


export default function socketCarts(io) {
    io.on("connection", async (socket) => {
        console.log('Cart conexion');
        
        socket.on('addedProduct', async data => {
          const productId = data; 
          console.log('Product ID:', productId);
      
          const productToAdd = await productsM.getProductBy({ _id: productId });
          console.log('Product to add:', productToAdd);
          const productsArray = Object.values(productToAdd);// Convierte el objeto en un array
       
          if (socket.request.user) {
            const userId = socket.request.user._id;
            console.log('User ID:', userId);
            const user = await usersServices.getUserBy({ _id: userId }); 

            //Si el usuario esta logeado y tiene un cart ID entonces empujo el producto al carrito
          if(user && user.cart.length !== 0){
            const carrito = await cartsM.updateCart(productsArray);
            console.log('Cart updated:', carrito);
          }else{
            //Si el usuario esta logeado y no tiene un cart ID entonces creo el carrito
            const carritoNuevo = await cartsM .createCart(productsArray);
            console.log('Cart created:', carritoNuevo);
          }
        } else {
            console.log('The user is not logged in')
        }
      });
    })
  }
