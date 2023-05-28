import CartManager from "../dao/mongo/managers/cartManager.js";
import ProductManager from "../dao/mongo/managers/productManager.js";


const cartManager = new CartManager();
const productManager = new ProductManager

export default function  productSocket(io) {
    io.on('connection', async (socket) => {
      
        
        console.log('Socket Product connected');
    
        const data = await productManager.getProducts();
        socket.emit('products', data);
    
        socket.on('newProduct', async newProductData => {
          console.log('Received new product:',newProductData);
          const { title, description, code, price, status, stock, category, thumbnails } = newProductData;
          const product = await productManager.createProduct({
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails: data.thumbnails ? JSON.stringify(data.thumbnail) : 'No image',
          });
          socket.emit('productsAdd', product);
        });
    
        socket.on('deleteProduct', async data => {
          await productManager.deleteProduct(data);
          const product = await productManager.getProducts();
          socket.emit('products', product);
        });
      });
}