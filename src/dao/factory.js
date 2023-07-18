import mongoose from "mongoose";
import config from '../config.js'

//Define que DAO tomar a partir de persistence
const persistence = 'MONGO';

//Depende de mi persistence que va a tomar si FilesSystem o Mongo
async function createCartDAO(persistenceType) {
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
async function createProductDAO(persistenceType) {
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


//Exporto para poder usarlo en repositories.js
export const CartDAO = await createCartDAO(persistence);
export const ProductDAO = await createProductDAO(persistence);

/*import mongoose from 'mongoose';
import config from '../config.js';

//Depende de mi persistence que va a tomar si FilesSystem o Mongo
async function CartDAO(persistenceType) {
    let cartsDAO;
    switch (persistenceType) {
      case 'FILESYSTEM':
        const {default: FileSystemDAO} = await import ('./fileSystem/Managers/cartManager.js')
        cartsDAO = new FileSystemDAO();
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

async function ProductDAO(persistenceType) {
    let productsDAO;
    switch(persistenceType){
        case 'FILESYSTEM': 
            const {default: FileSystemDAO} = await import ('./fileSystem/Managers/productManager.js')
            productsDAO = new FileSystemDAO();
            break;
        case 'MONGO':
            mongoose.connect(config.mongoSecret.MongoURL);
            const {default: MongoDAO} = await import ('./mongo/managers/productManager.js')
            productsDAO = new MongoDAO();
            break;
        default:
            throw new Error(`Invalid persistence type: ${persistenceType}`);
    }
    return productsDAO;
}

export { CartDAO, ProductDAO };*/
