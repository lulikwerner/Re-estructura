import { passportCall } from '../services/auth.js';
import BaseRouter from './Router.js';
import cartsController from '../controllers/carts.controller.js'


export default class CartsRouter extends BaseRouter {

  init() {

//Busca un cart
//http://localhost:8080/api/carts/:cid
//Funciona ok pero tengo que limitar que solo el usuario pueda ver unicamente su carrito
this.get('/:cid',['USER'],passportCall('jwt', { strategyType: 'jwt' }),cartsController.getCartById);

//Crea carrito y agrega producto al carrito
//http://localhost:8080/api/carts/    
this.post('/',['USER'],passportCall('jwt', { strategyType: 'jwt' }), cartsController.addProductToCart);

//Agrega un producto con su cantidad al carrito
//http://localhost:8080/api/carts/:cid/product/:pid
this.post('/:cid/product/:pid',['USER'],passportCall('jwt', { strategyType: 'jwt' }), cartsController.postProductInCart);
  
//Deberá actualizar el carrito con un arreglo de productos con el formato especificado arriba. USER O ADMIN?
//http://localhost:8080/api/carts/:cid
this.put('/:cid', ['USER'],passportCall('jwt', { strategyType: 'jwt' }),cartsController.updateCart);

//Actualiza SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body. Si paso 3 por body voy a tener entonces 3 en qty
//http://localhost:8080/api/carts/:cid/product/:pid
this.put('/:cid/product/:pid', ['USER'],passportCall('jwt', { strategyType: 'jwt' }), cartsController.updateQtyProductInCart);

//Elimina del carrito seleccionado el producto seleccionado
//http://localhost:8080/api/carts/:cid/products/:pid
this.delete('/:cid/products/:pid',['USER'],passportCall('jwt', { strategyType: 'jwt' }), cartsController.deleteProductInCart);

//Elimina los productos del carrito. Lo vacia
//http://localhost:8080/api/carts/:cid
this.delete('/:cid',['USER'],passportCall('jwt', { strategyType: 'jwt' }), cartsController.deleteCart);

//Finaliza el proceso de compra
//http://localhost:8080/api/carts/:cid/purchase
this.post('/:cid/purchase',['USER'],passportCall('jwt', { strategyType: 'jwt' }), cartsController.checkoutCart);

//Muestra el ticket de compra 
//http://localhost:8080/api/carts/:cid/purchase
this.get('/:cid/purchase',['USER'],passportCall('jwt', { strategyType: 'jwt' }), cartsController.checkoutDisplay);
  }
}

