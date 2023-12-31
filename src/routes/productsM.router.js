import { passportCall } from '../services/auth.js';
import BaseRouter from "./Router.js";
import productsController from "../controllers/products.controller.js";


export default class ProductsRouter extends BaseRouter {

  init() {
/*router.get('/', async (req, res) => {
const { limit, page, sort, category } = req.query;

   // const result  = await productModel.paginate({},{limit:10,lean:true})
   //console.log(result)
   // res.status(200).send({ status: 'success', payload: result});    
try{

        const products = await productsM.getProducts();
        if (!limit) {
            const withoutlimit = products.slice(0, 10);
        res.status(200).send({ status: 'success', payload: withoutlimit });
           // res.send({ status: 'success', payload: products });
        } else {
        // Si el limit que me envían es menor a 0 o una letra, me manda un error
        if (limit < 0 || isNaN(limit)) {
            return res.status(400).send({ status: 'error', message: 'Please enter a valid value' });
        }
        // Si me envían un limit, hago un slice del array por el límite enviado y traigo solo esos productos
        const limitedProducts = products.slice(0, limit);
        res.status(200).send({ status: 'success', payload: limitedProducts });
        
            }      
    }catch(error) {
        console.log(error);
    }

});*/

//Crea el producto
//http://localhost:8080/api/products
this.post('/',['ADMIN'], passportCall('jwt', {strategyType: 'jwt'}), productsController.postProducts);

//Busca el producto
//http://localhost:8080/api/products/:pid
this.get('/:pid',['PUBLIC'], passportCall('jwt', {strategyType: 'jwt'}), productsController.getProductsById);

//Actualiza el producto
//http://localhost:8080/api/products/:pid
this.put('/:pid',['ADMIN'], passportCall('jwt', {strategyType: 'jwt'}),productsController.putProducts); 

//Borra el producto
//http://localhost:8080/api/products/:pid
this.delete('/:pid',['ADMIN'], passportCall('jwt', {strategyType: 'jwt'}),productsController.deleteProducts); 

}
}