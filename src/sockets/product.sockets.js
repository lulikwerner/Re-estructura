import { productsM } from '../dao/mongo/managers/index.js'
import config from '../config.js'
import LoggerService from '../services/LoggerService.js';


const logger = new LoggerService(config.logger.type); 

export default function  productSocket(io) {
    io.on('connection', async (socket) => {
      logger.logger.debug('Socket Product connected');
    
        const data = await productsM.getProducts();
        socket.emit('products', data);
    
        socket.on('newProduct', async newProductData => {
          logger.logger.info('Received new product:',newProductData);
          const { title, description, code, price, status, stock, category, thumbnails } = newProductData;
          const product = await productsM.createProduct({
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
          await productsM.deleteProduct(data);
          const product = await productsM.getProducts();
          socket.emit('products', product);
        });
      });
}