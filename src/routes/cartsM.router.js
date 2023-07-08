import { passportCall } from '../services/auth.js';
import BaseRouter from './Router.js';
import cartsController from '../controllers/carts.controller.js'


export default class CartsRouter extends BaseRouter {

  init() {

//Busca un cart
//http://localhost:8080/api/carts/:cid
//Funciona ok pero tengo que limitar que solo el usuario pueda ver unicamente su carrito
this.get('/:cid',['PRIVATE'],passportCall('jwt', { strategyType: 'jwt' }),cartsController.getCartById);

//Crea carrito y agrega producto al carrito
//http://localhost:8080/api/carts/    
this.post('/',['USER'],passportCall('jwt', { strategyType: 'jwt' }), cartsController.addProductToCart);

//Agrega un producto con su cantidad al carrito
//http://localhost:8080/api/carts/:cid/product/:pid
//Funciona ok
this.post('/:cid/product/:pid',['USER'],passportCall('jwt', { strategyType: 'jwt' }), cartsController.postProductInCart);
  
//Deberá actualizar el carrito con un arreglo de productos con el formato especificado arriba.
//http://localhost:8080/api/carts/:cid
this.put('/:cid', ['USER'],passportCall('jwt', { strategyType: 'jwt' }),cartsController.updateCart);

//Actualiza SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body. Si paso 3 por body voy a tener entonces 3 en qty
//http://localhost:8080/api/carts/:cid/product/:pid
//Funciona ok 
this.put('/:cid/product/:pid', ['USER'],passportCall('jwt', { strategyType: 'jwt' }), cartsController.updateQtyProductInCart);

//Elimina del carrito seleccionado el producto seleccionado
//http://localhost:8080/api/carts/:cid/products/:pid
//Funciona ok
this.delete('/:cid/products/:pid',['USER'],passportCall('jwt', { strategyType: 'jwt' }), cartsController.deleteProductInCart);

//Elimina la productos del carrito. Lo vacia
//http://localhost:8080/api/carts/:cid
//Funciona ok
this.delete('/:cid',['USER'],passportCall('jwt', { strategyType: 'jwt' }), cartsController.deleteCart);
  }
}

