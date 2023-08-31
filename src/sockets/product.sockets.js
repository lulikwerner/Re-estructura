import { productsM } from '../dao/mongo/managers/index.js'
import config from '../config.js'
import LoggerService from '../services/LoggerService.js';
import { userService } from '../services/repositories.js';
import nodemailer from 'nodemailer'

const logger = new LoggerService(config.logger.type); 

const transport = nodemailer.createTransport({
  service:'gmail',
  port:587,
  auth:{
    user:config.app.email,
    pass:config.app.password
  }
})

export default function  productSocket(io) {
    io.on('connection', async (socket) => {
      logger.logger.debug('Socket Product connected');
        const data = await productsM.getProducts();
        socket.emit('products', data);
    
        socket.on('newProduct', async newProductData => {
          //logger.logger.info('Received new product:',newProductData);
          console.log('newProductData ', newProductData )
          console.log('thumbnails', newProductData.data.thumbnails);
          const { data, userEmail } = newProductData;
          const { title, description, code, price, status, stock, category, thumbnail } = data;
          const thumbnailBuffer = Buffer.from(newProductData.data.thumbnails).toString('base64');

          const product = await productsM.createProduct({
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnail: thumbnailBuffer ||'No image',
            owner:userEmail 
          });
          socket.emit('productsAdd', product);
        });
        
        socket.on('deleteProduct', async (btnId,ownerEmail) => {
          //Busco el usuario
          const ownerUser = await userService.getUserByService({ email: ownerEmail })
          const userRole = ownerUser.role
          console.log(userRole)
          //email
          if(userRole==='PREMIUM'){
             await transport.sendMail({
                from:'Luli Store <config.app.email>',
                to:`${ownerEmail}`,
                subject:'Su producto fue eliminado',
                //Le doy el formato a mi email lo puedo guardar en un componentes
                html:`
                <div>
                <h1>Se elimino uno de sus productos </h1>
                <h2> Este mail es para confirmar que el producto ${btnId} ha sido eliminado</h2>
                </div>`
            })
        }

          await productsM.deleteProduct(data);
          const product = await productsM.getProducts();
          socket.emit('products', product);
        });
      });
}