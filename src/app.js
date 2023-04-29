import express from 'express';
import fs from 'fs';
import handlebars from 'express-handlebars'
import { Server } from 'socket.io';
import __dirname from './utils.js'
import ProductManager from './managers/productManager.js';
import productRouter from './routes/products.router.js';
import cartRouter from './routes/carts.router.js'
import viewsRouter from './routes/views.router.js'


const app = express();
const PORT = process.env.PORT||8080;
const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`))
const io = new Server(server);
const productManager = new ProductManager();

app.engine('handlebars',handlebars.engine());
app.set('views',`${__dirname}/views`);
app.set('view engine', 'handlebars')


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(`${__dirname}/public`)); 
app.use((req,res,next)=>{
  req.io =io;
    next();
});

app.use('/', productRouter);
app.use('/api/realtimeProducts', viewsRouter);




io.on('connection', async socket=>{
  console.log('Socket connected');
  const data = await productManager.getProducts();
  socket.emit('products', data);


socket.on('newProduct', async formData => {
  console.log('Received new product:', formData);
  const product = await productManager.addProducts({
    title: formData.title,
    description: formData.description,
    code: formData.code,
    price: formData.price,
    status: formData.status,
    stock: formData.stock,
    category: formData.category,
    thumbnails: formData.thumbnails,
  });
  console.log('Added new product:', product);
  socket.emit('newProduct', product);
});








  socket.on('deleteProduct', async data=>{
    await productManager.deleteProduct(data);
    const product = await productManager.getProducts();
    socket.emit('deleteProduct', product)
  })
});

      


//app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);












