import { passportCall } from '../services/auth.js';
import BaseRouter from "./Router.js";
import productsController from "../controllers/products.controller.js";
import LoggerService from '../services/LoggerService.js';
import config from '../config.js';
import modifyProducts from '../middlewares/modifyProducts.js';
import uploader from "../middlewares/uploader.js";

const logger = new LoggerService(config.logger.type); 

export default class ProductsRouter extends BaseRouter {

  init() {

//Va a devolver 100 productos de prueba
this.get('/mock',['ADMIN'], passportCall('jwt', {strategyType: 'jwt'}),productsController.mock);

//Crea el producto
//http://localhost:8080/api/products
this.post('/',['PREMIUM', 'ADMIN'], passportCall('jwt', {strategyType: 'jwt'}),uploader.single('thumbnail'), productsController.postProducts);

//Busca el producto
//http://localhost:8080/api/products/:pid
this.get('/:pid',['PUBLIC'], passportCall('jwt', {strategyType: 'jwt'}), productsController.getProductsById);

//Actualiza el producto
//http://localhost:8080/api/products/:pid
this.put('/:pid',['ADMIN','PREMIUM'], passportCall('jwt', {strategyType: 'jwt'}),modifyProducts,productsController.putProducts); 

//Borra el producto
//http://localhost:8080/api/products/:pid
this.delete('/:pid',['ADMIN', 'PREMIUM'], passportCall('jwt', {strategyType: 'jwt'}),modifyProducts,productsController.deleteProducts); 

}
}