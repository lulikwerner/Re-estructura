import CartManager from "../dao/mongo/managers/cartManager.js";
import ProductManager from "../dao/mongo/managers/productManager.js";


const cartManager = new CartManager();
const productManager = new ProductManager

export default function socketCarts(io) {
    io.on("connection", async (socket) => {
        console.log('Socket cart pre conexion');
 
        
        socket.on('addedProduct', async data => {
          console.log('pid',data)
          const productToAdd = await productManager.getProductBy({ _id: data })
         console.log( 'el producto agregadp',productToAdd)
          console.log(data)
          await cartManager.createCart(data);
          console.log('carro creado')
          
        
        });
      })
    }
