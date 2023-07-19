import mongoose from "mongoose";
import config from '../config.js'

//Define que DAO tomar a partir de persistence
const persistence = 'MONGO';

//Depende de mi persistence que va a tomar si FilesSystem o Mongo
export async function CartDAO(persistenceType) {
    let cartsDAO;
    switch (persistenceType) {
      case 'FILESYSTEM':
        const {default: FileSystemDAO} = await import ('./fileSystem/Managers/cartManager.js')
        cartsDAO = new MemoryDAO();
        break;
      case 'MONGO':
        mongoose.connect(config.mongoSecret.MongoURL);
        const {default: MongoDAO} = await import ('./mongo/managers/cartManager.js')
        cartsDAO = new MongoDAO();
        break;
        default:
            throw new Error(`Invalid persistence type: ${persistenceType}`);
    }
    return cartsDAO;
}
  //Depende de mi persistence que va a tomar si FilesSystem o Mongo
export async function ProductDAO(persistenceType) {
        let productsDAO;
        switch(persistenceType){
            case 'FILESYSTEM': 
                const {default: FileSystemDAO} = await import ('./fileSystem/Managers/productManager.js')
                productsDAO = new MemoryDAO();
                break;
            case 'MONGO':
                mongoose.connect(config.mongoSecret.MongoURL);
                const {default: MongoDAO} = await import ('./mongo/managers/productManager.js')
                productsDAO = new MongoDAO();
                break;
        }
        return productsDAO;
}
export async function CheckoutDAO(persistenceType) {
  let ticketDAO;
  switch(persistenceType){
      case 'FILESYSTEM': 
          const {default: FileSystemDAO} = await import ('./mongo/managers/checkoutManager.js')
          ticketDAO = new MemoryDAO();
          break;
      case 'MONGO':
          mongoose.connect(config.mongoSecret.MongoURL);
          const {default: MongoDAO} = await import ('./mongo/managers/checkoutManager.js')
          ticketDAO = new MongoDAO();
          break;
  }
  return ticketDAO;
}


//Exporto para poder usarlo en repositories.js
export const createCartDAO = await CartDAO(persistence);
export const createProductDAO = await ProductDAO(persistence);
export const createCheckoutDAO = await CheckoutDAO(persistence);


/*

//Usando los commands
import mongoose from "mongoose";
import config from '../config.js'


//Depende de mi persistence que va a tomar si FilesSystem o Mongo
export async function createCartDAO(persistenceType) {
    let cartsDAO;
    switch (persistenceType) {
      case 'FILESYSTEM':
        const {default: FileSystemDAO} = await import ('./fileSystem/Managers/cartManager.js')
        cartsDAO = new MemoryDAO();
        break;
      case 'MONGO':
        mongoose.connect(config.mongoSecret.MongoURL);
        const {default: MongoDAO} = await import ('./mongo/managers/cartManager.js')
        cartsDAO = new MongoDAO();
        break;
        default:
            throw new Error(`Invalid persistence type: ${persistenceType}`);
    }
    return cartsDAO;
}
  //Depende de mi persistence que va a tomar si FilesSystem o Mongo
export async function createProductDAO(persistenceType) {
        let productsDAO;
        switch(persistenceType){
            case 'FILESYSTEM': 
                const {default: FileSystemDAO} = await import ('./fileSystem/Managers/productManager.js')
                productsDAO = new MemoryDAO();
                break;
            case 'MONGO':
                mongoose.connect(config.mongoSecret.MongoURL);
                const {default: MongoDAO} = await import ('./mongo/managers/productManager.js')
                productsDAO = new MongoDAO();
                break;
        }
        return productsDAO;
}
export async function createCheckoutDAO(persistenceType) {
  let ticketDAO;
  switch(persistenceType){
      case 'FILESYSTEM': 
          const {default: FileSystemDAO} = await import ('./mongo/managers/checkoutManager.js')
          ticketDAO = new MemoryDAO();
          break;
      case 'MONGO':
          mongoose.connect(config.mongoSecret.MongoURL);
          const {default: MongoDAO} = await import ('./mongo/managers/checkoutManager.js')
          ticketDAO = new MongoDAO();
          break;
  }
  return ticketDAO;
}*/
