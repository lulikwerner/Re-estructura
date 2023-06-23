import CartManager from "../dao/mongo/managers/cartManager.js";
import ProductManager from "../dao/mongo/managers/productManager.js";


const cartManager = new CartManager();
const productManager = new ProductManager

export default function socketCarts(io) {
    io.on("connection", async (socket) => {
        console.log('Cart conexion');
        
        socket.on('addedProduct', async data => {
          const productId = data; // Assuming data is the product ID
          console.log('Product ID:', productId);
        
          const productToAdd = await productManager.getProductBy({ _id: productId });
          console.log('Product to add:', productToAdd);
        
          const productsArray = Object.values(productToAdd); // Convert the product object to an array
          const carritoNuevo = await cartManager.createCart(productsArray);
          console.log('Cart created:', carritoNuevo);
        });

      })
    }
