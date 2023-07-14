import { cartService, productService, userService } from '../services/repositories.js'
import ticketModel from '../dao/mongo/models/tickets.js';
import { v4 as uuidv4 } from 'uuid';

const addProductToCart = async (req, res) => {
    const products = req.body;
    const cart = req.body;
    try {
        if (!Array.isArray(cart)) {
            return res.sendBadRequest('Cart should be an array');
            }
          // Chequeo si el pid o el qty tiene valores
            for (const products of cart) {
                if (!products.pid || !products.stock) {
                    return res.sendBadRequest('One or more fields are incomplete for a product' );
            }
            //Chequeo si las cantidades sean un numero o mayor a 0
            if (isNaN(products.stock)|| products.stock< 0) {
                return res.sendBadRequest('Enter a valid value for the  products' );
        }
            }
      const createdCart = await cartService.createCartService(products);
      if (!createdCart) {
        return res.sendBadRequest('Failed to create the cart' );
      }
    
      return res.sendSuccess ('Cart created and products added successfully');
    } catch (error) {
      if (error.message.includes('does not exist')) {
        return res.sendBadRequest('One or more products do not exist');
      }
      console.error(error);
      return res.sendInternalError( 'Internal server error' );
    }
};

const getCartById =  async (req, res) => {
    const { cid } = req.params;
  
    try {
        const cart = await cartService.getCartByIdService(cid);
        console.log(cid)
        console.log('el cartt', cart)
        
      // If the cart is not found, send an error response
        if (!cart) {
        return res.sendBadRequest('Cart not found' );
        }   
      // If the cart is found, send the product information
      res.render('cart',{carth:cart} );
    } catch (error) {
        console.log(error);
        res.sendInternalError('Internal server error');
    }
};

const postProductInCart = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body
    console.log(pid)
    console.log('cid',cid)
    console.log('qty',quantity)
    const {  title, description, code, price, stock, category, thumbnails} = req.body;
    try {
      //Evaluo que la cantidad enviada sea un numero
      if (isNaN(Number(quantity))) return res.sendBadRequest('The quantity has to be a number');
      //Evaluo que la cantidad sea mayor a 1
      if (quantity < 1) return res.sendBadRequest('The quantity must be greater than 1' );
      //Busco el Producto
      const checkIdProduct = await productService.getProductByService({ _id: pid });
        //Si no se encuentra el producto
        if (!checkIdProduct) { return res.sendBadRequest('Product not found')};
     //Busco el carrito
      const checkIdCart = await cartService.getCartByIdService({ _id: cid });
   
      //Si no se encuentra el carrito
      if(!checkIdCart){  return res.sendBadRequest('Cart not found')};
      //Tiene que enviar algun dato aunque sea para modificar
      if (!title && !description && !code && !price && !stock && !category && !quantity) {
        return res.sendBadRequest('Please send a new value to update');
    }
      // Si paso el parametro qty para modificar
      if (isNaN(quantity) || quantity < 0) {
        return res.sendBadRequest('Quantity should be a valid value' );
      }
      // Hago un update del cart , enviando el products y el cid
      const up=await cartService.updateQtyCartService (cid,checkIdProduct, quantity);
      console.log('Product quantity added successfully',up);
      return  res.sendSuccess('Product quantity added successfully' );
 
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
};

const deleteProductInCart = async (req, res) => {
    const { cid, pid } = req.params;
    try {
      // Si no se envia ningun id de carrito
      if (!cid)  {
        return res.sendBadRequest('Please enter a cart ID' );
      }
      // Busco el Id del carrito en carts
      const cart = await cartService.getCartByIdService({ _id: cid });
      // Si no se encuentra el carrito en carts
      if (!cart) {
        return res.sendBadRequest('Cart not found');
      }
      if (cart.products.length === 0) {
        return res.sendBadRequest('The cart is empty' );
      }
      // Si no se envia ningun pid
      if (!pid) {
        return res.sendBadRequest('Please enter a valid product ID' );
      }
      // Busco el pid en el carrito
      const productIndex = cart.products.findIndex((product) => {
        const productId = product.product._id.toString(); // Access the nested _id value
        console.log('productindex',productId )
        return productId === pid;
        
      });
      // Si no encuentro el producto en el array
      if (productIndex === -1) {
        return res.sendBadRequest('Product not found in the cart');
      }
      //Si encuentro el producto en el array lo borro
      cart.products.splice(productIndex, 1);
      // Hago el update en el carrito
      await cartService. deleteProductInCartService(cid, cart.products);
      // Send a success response with the updated cart
      return res.status(200).send({ status: 'success', message: `Product with ID ${pid} removed from the cart`, cart });
    } catch (error) {
      return res.sendBadRequest('Product could not be removed from the cart' );
    }
};

const deleteCart = async (req,res) =>{
    const { cid } = req.params;
    console.log('entre')
    try {
  
      // Si no se envia ningun id de carrito
      if (!cid)  {
        res.sendBadRequest('Please enter a cart ID' );
      }
      // Busco el Id del carrito en carts
      const cart = await cartService.getCartByIdService({ _id: cid });
      console.log(cart)
      // Si no se encuentra el carrito en carts
      if (!cart) {
        return res.sendBadRequest('Cart not found' );
      }
      if (cart.products.length === 0){
        return res.sendBadRequest('The cart is already empty')
      }
   //Update el carrito con un array vacio
   await cartService.emptyCartService (cid);
  // Send a success response
     return res.sendSuccess('The cart is empty')
      } catch (error) {
        return res.sendBadRequest('Could not empty cart' );
      }
    };

const updateCart = async (req, res) => {
    try {
      const { cid } = req.params;
      const products = req.body;
      if (!Array.isArray(products)) {
        return res.status(400).json({ message: 'Products must be an array' });
      }
      const productIds = products.map((product) => product.pid);
      // Mano a llamar a updateProductsInCart 
      const updatedCart = await cartService.updateProductsInCartService (cid, products);
    
      await updatedCart.save();
  console.log(JSON.stringify(updatedCart, null, '\t'));
        res.status(200).json({ message: 'Cart updated successfully', cart: updatedCart });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error', error: err });
    }
};

const updateQtyProductInCart = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    console.log('qty',quantity)
    console.log('pid',pid)
    try {
      if (!cid ) {
        return res.sendBadRequest('Please enter a cart ID' );
      }
      const cart = await cartService.getCartByIdService({ _id: cid });
      if (!cart) {
        return res.status(404).send({ status: 'error', message: 'Cart not found' });
      }
      if (cart.products.length === 0) {
        return res.sendBadRequest('The cart is empty' );
      }
      if (!pid) {
        return res.sendBadRequest( 'Please enter a valid product ID' );
      }
      if (quantity === undefined || quantity=== '') {
        return res.sendBadRequest('Please send a new value to update' );
      }
      if (isNaN(quantity) || quantity < 0) {
        return res.sendBadRequest('Quantity should be a valid value' );
      }
      const productToUpdate = cart.products.find(product => product.product._id.toString() === pid);
      if (!productToUpdate) {
        return res.status(404).send({ status: 'error', message: 'Product not found in the cart' });
      }
      productToUpdate.quantity = Number(quantity);
      const cartUpd = await cartService.updateCartService(cid, pid, quantity);
      await cartUpd.save();
      console.log(JSON.stringify(cartUpd, null, '\t'));
      return res.sendSuccess('Product updated successfully');
    } catch (error) { 
      console.log('Error:', error);
      return res.sendBadRequest('Product could not be updated' );
    }
};

const checkoutCart = async  (req,res) => {

  console.log('llegamos hasta aca ')
  const { cid } = req.params;

  console.log(cid)
  //Primero busco si existe el cart
  try{
    const cartExist = await cartService.getCartByIdService(cid)
    console.log(JSON.stringify(cartExist , null, '\t'));
  if(cartExist){
    //Ahora calculo el total de cada producto  por separado
    const subtotalProduct = [];
    Object.values(cartExist.products).forEach((product) => {
      const subtotal = product.product.price * product.quantity
      let prod = {
        name:product.product.title,
        price: product.product.price,
        quantity: product.quantity,
        subtotal
      }
      subtotalProduct.push(prod)
    });
    console.log(subtotalProduct)
    
    //Ahora Obtengo el total del cart
    let totalProduct = 0;
    subtotalProduct.forEach((subtotal) => {
      totalProduct += subtotal.subtotal;
    })
    console.log('Total:', totalProduct);

     // Creo el ticket
     const ticket = new ticketModel({
      code: uuidv4(),
      amount: totalProduct,
      purchaser: 'luli@MediaList.com'
    });

  // Lo guardo en la BD
    await ticket.save();
//Devuelvo el ticket
console.log(ticket)
    return res.sendSuccess(ticket);
   
  } else {
    return res.sendBadRequest('Cart does not exist');
  }
    


    }catch(error){
      console.log('Error:', error);
      return res.sendBadRequest('Purchase could not be completed');
    }
  };
  







 



export default {
    addProductToCart,
    getCartById,
    postProductInCart,
    deleteProductInCart,
    deleteCart,
    updateCart ,
    updateQtyProductInCart,
    checkoutCart,
}