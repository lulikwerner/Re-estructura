import { Router } from 'express';
import CartManager from "../dao/mongo/managers/cartManager.js";
import ProductManager from "../dao/mongo/managers/productManager.js"
import mongoose from "mongoose"


const router = Router();
const cartsM = new CartManager();
const productM = new ProductManager()

//Agrega producto al carrito
router.post('/', async (req, res) => {
    const products = req.body;
    const cart = req.body;
    try {
        if (!Array.isArray(cart)) {
            return res.status(400).send({ status: 'error', message: 'Cart should be an array' });
            }
          // Chequeo si el pid o el qty tiene valores
            for (const products of cart) {
                if (!products.pid || !products.stock) {
                    return res.status(400).send({ status: 'error', message: 'One or more fields are incomplete for a product' });
            }
            //Chequeo si las cantidades sean un numero o mayor a 0
            if (isNaN(products.stock)|| products.stock< 0) {
                return res.status(400).send({ status: 'error', message: 'Enter a valid value for the  products' });
        }
            }
      const createdCart = await cartsM.createCart(products);
      if (!createdCart) {
        return res.status(400).send({ status: 'error', message: 'Failed to create the cart' });
      }
    
      return res.status(200).json({ message: 'Cart created and products added successfully' });
    } catch (error) {
      if (error.message.includes('does not exist')) {
        return res.status(400).send({ status: 'error', message: 'One or more products do not exist' });
      }
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
});


router.get('/:cid', async (req, res) => {
  const { cid } = req.params;

  try {
      const cart = await cartsM.getCartBy({_id: cid});
    // If the cart is not found, send an error response
      if (!cart) {
      return res.status(404).send({ status: 'error', message: 'Cart not found' });
      }   
    // If the cart is found, send the product information
      res.send({ status: 'success', payload: cart });
  } catch (error) {
      console.log(error);
      res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});


router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const {  title, description, code, price, stock, category, thumbnails} = req.body;
    const products = [{ qty, title, description, code, price, stock, category, thumbnails}];
    try {
        //Si no se encuentra el carrito
        if (!cid) { console.log('Cart not found');
            return;}
      // Validate the product ID value
      console.log('cid',cid)
      console.log('pidNumber:', pid);

      //Tiene que enviar algun dato aunque sea para modificar
      if (!title && !description && !code && !price && !status && !stock && !category) {
        return res.status(400).send({ status: "error", message: "Please send a new value to update" });
    }
      // Si paso el parametro qty para modificar
      if (isNaN(stock) || stock < 0) {
        console.log('Invalid stock');
        console.log('stock:', stock);
 
        return res.status(400).send({ status: 'error', message: 'Quantity should be a valid value' });
      }
      // Hago un update del cart , enviando el products y el cid
      const up=await cartsM.updateCart (products, cid);
      console.log('Product added successfully',up);
      return res.status(200).send({ status: 'success', message: 'Product added successfully' });
    } catch (error) {
      console.log('Error:', error);
      return res.status(400).send({ status: 'failed', message: 'Product could not be added' });
    }
  });
  
//deberá eliminar del carrito el producto seleccionado.
router.delete('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  try {
    // Si no se envia ningun id de carrito
    if (!cid || !mongoose.Types.ObjectId.isValid(cid))  {
      return res.status(400).send({ status: 'error', message: 'Please enter a cart ID' });
    }
    // Busco el Id del carrito en carts
    const cart = await cartsM.getCartBy({ _id: cid });
    // Si no se encuentra el carrito en carts
    if (!cart) {
      return res.status(404).send({ status: 'error', message: 'Cart not found' });
    }
    if (cart.products.length === 0) {
      return res.status(400).send({ status: 'error', message: 'The cart is empty' });
    }
    // Si no se envia ningun pid
    if (!pid || !mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).send({ status: 'error', message: 'Please enter a valid product ID' });
    }
    // Busco el pid en el carrito
    const productIndex = cart.products.findIndex((product) => {
      const productId = product.product._id.toString(); // Access the nested _id value
      return productId === pid;
    });
    // Si no encuentro el producto en el array
    if (productIndex === -1) {
      return res.status(404).send({ status: 'error', message: 'Product not found in the cart' });
    }
    //Si encuentro el producto en el array lo borro
    cart.products.splice(productIndex, 1);
    // Hago el update en el carrito
    await cartsM.deleteProductInCart(cid, cart.products);
    // Send a success response with the updated cart
    return res.status(200).send({ status: 'success', message: `Product with ID ${pid} removed from the cart`, cart });
  } catch (error) {
    return res.status(400).send({ status: 'failed', message: 'Product could not be removed from the cart' });
  }
});

//Deberá eliminar todos los productos del carrito 
router.delete('/:cid', async (req,res) =>{
  const { cid } = req.params;
  try {
    // Si no se envia ningun id de carrito
    if (!cid || !mongoose.Types.ObjectId.isValid(cid))  {
      return res.status(400).send({ status: 'error', message: 'Please enter a cart ID' });
    }
    // Busco el Id del carrito en carts
    const cart = await cartsM.getCartBy({ _id: cid });
    // Si no se encuentra el carrito en carts
    if (!cart) {
      return res.status(404).send({ status: 'error', message: 'Cart not found' });
    }
 //Update el carrito con un array vacio
 await cartsM. emptyCart (cid);
// Send a success response
   return res.status(200).send({ status: 'success', message: 'The cart is empty'})
    } catch (error) {
      return res.status(400).send({ status: 'failed', message: 'Could not empty cart' });
    }

});
//deberá actualizar el carrito con un arreglo de productos con el formato especificado arriba.
router.put('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const products = req.body;

 
    if (!Array.isArray(products)) {
      return res.status(400).json({ message: 'Products must be an array' });
    }

    const productIds = products.map((product) => product.pid);
    // Call the updateProductsInCart function with the necessary arguments
    const updatedCart = await cartsM.updateProductsInCart(cid, products);
    console.log(JSON.stringify(updatedCart, null, '\t'));
  const verificar = await cartsM.getCartBy(cid)
  console.log(JSON.stringify(verificar, null, '\t'));
    if (updatedCart) {
      res.status(200).json({ message: 'Cart updated successfully', cart: updatedCart });
      //console.log(JSON.stringify(updatedCart, null, '\t'));
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error', error: err });
  }
});

//deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
router.put('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { qty } = req.body;
  try {
    if (!cid || !mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).send({ status: 'error', message: 'Please enter a cart ID' });
    }
    const cart = await cartsM.getCartBy({ _id: cid });
    if (!cart) {
      return res.status(404).send({ status: 'error', message: 'Cart not found' });
    }
    if (cart.products.length === 0) {
      return res.status(400).send({ status: 'error', message: 'The cart is empty' });
    }
    if (!pid || !mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).send({ status: 'error', message: 'Please enter a valid product ID' });
    }
    if (qty === undefined || qty === '') {
      return res.status(400).send({ status: 'error', message: 'Please send a new value to update' });
    }
    if (isNaN(qty) || qty < 0) {
      return res.status(400).send({ status: 'error', message: 'Quantity should be a valid value' });
    }
    const productToUpdate = cart.products.find(product => product.product._id.toString() === pid);
    if (!productToUpdate) {
      return res.status(404).send({ status: 'error', message: 'Product not found in the cart' });
    }
    productToUpdate.qty = Number(qty);
    const cartUpd = await cartsM.updateQtyCart(cid, pid, qty);
    await cartUpd.save();
    console.log(JSON.stringify(cartUpd, null, '\t'));
    return res.status(200).send({ status: 'success', message: 'Product updated successfully' });
  } catch (error) {
    console.log('Error:', error);
    return res.status(400).send({ status: 'failed', message: 'Product could not be updated' });
  }
});

export default router;


