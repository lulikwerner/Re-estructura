import CartManager from "../dao/mongo/managers/cartManager.js";


const cartManager = new CartManager();


export default function socketCarts(io) {
    io.on("connection", async (socket) => {
        console.log('Socket cart pre conexion');
 
        
        socket.on('cart', async (data) => {
            const cid = data.cid; // Obtain the 'cid' value from the data sent by the client
            console.log('Socket cart conexion');
            const carts = await cartManager.getCartBy(cid);
            console.log(cid);
            console.log(JSON.stringify(carts, null, '\t'));
            socket.emit('homeCart', carts);
          });
        });
      }