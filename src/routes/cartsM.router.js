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
                if (!products.pid || !products.qty) {
                    return res.status(400).send({ status: 'error', message: 'One or more fields are incomplete for a product' });
            }
            //Chequeo si las cantidades sean un numero o mayor a 0
            if (isNaN(products.qty)|| products.qty < 0) {
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
    const { qty, title, description, code, price, stock, category, thumbnails} = req.body;
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
      if (isNaN(qty) || qty < 0) {
        console.log('Invalid quantity');
        console.log('qty:', qty);
        console.log('typeof qty:', typeof qty);
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
    console.log('cid', cid);
    console.log('pidNumber:', pid);
    
    // If no cart ID is provided, send an error response
    if (!cid) {
      return res.status(400).send({ status: 'error', message: 'Please enter a cart ID' });
    }
    
    // Retrieve the cart by its ID
    const cart = await cartsM.getCartBy({ _id: cid });
    
    // If the cart is not found, send an error response
    if (!cart) {
      return res.status(404).send({ status: 'error', message: 'Cart not found' });
    }
    
    console.log(JSON.stringify(cart, null, '\t'));
    
    // If no product ID is provided, send an error response
    if (!pid || !mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).send({ status: 'error', message: 'Please enter a valid product ID' });
    }
    
    // Find the index of the product in the cart's products array
    const productIndex = cart.products.findIndex((product) => {
      const productId = product.product._id.toString(); // Access the nested _id value
      console.log('productId:', productId);
      console.log('pid:', pid);
      return productId === pid;
    });
    
    // If the product is not found in the cart, send an error response
    if (productIndex === -1) {
      return res.status(404).send({ status: 'error', message: 'Product not found in the cart' });
    }
    
    // Remove the product from the cart's products array
    cart.products.splice(productIndex, 1);
    
    // Update the cart in the database
    await cartsM.deleteProductInCart(cid, cart.products);
    
    // Send a success response with the updated cart
    return res.status(200).send({ status: 'success', message: `Product with ID ${pid} removed from the cart`, cart });
  } catch (error) {
    console.log('Error:', error);
    return res.status(400).send({ status: 'failed', message: 'Product could not be removed from the cart' });
  }
});



//deberá eliminar todos los productos del carrito 
router.delete('api/carts/:cid', async (req,res) =>{

});
//deberá actualizar el carrito con un arreglo de productos con el formato especificado arriba.
router.put('/carts/:cid', async (req,res)=>{
})
//deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
router.put('/carts/:cid/products/:pid ', async (req,res)=>{
  const { cid, pid } = req.params;
    const { qty} = req.body;
    const products = [{ qty, title, description, code, price, stock, category, thumbnails}];
    try {
      const checkProduct = await productM.getProductById(pid);
        if (!checkProduct) return response.status(404).send({error: `The ID product: ${pid} not found`})
        const checkCart = await cartsM.getCartBy({ _id: cid });
        if (!checkCart) {
          return res.status(404).send({ status: 'error', message: `We couldn't find the cart ${cid}`  });
        }
        //Si no se encuentra el carrito
        if (!cid) { console.log('Cart not found');
            return;}
      // Validate the product ID value
      console.log('cid',cid)
      console.log('pidNumber:', pid);

      //Tiene que enviar la cantidad a modificar
      if (!qty) {
        return res.status(400).send({ status: "error", message: "Please send a new value to update" });
    }
      // Si paso el parametro qty para modificar
      if (isNaN(qty) || qty < 0) {
        console.log('Invalid quantity');
        console.log('qty:', qty);
        console.log('typeof qty:', typeof qty);
        return res.status(400).send({ status: 'error', message: 'Quantity should be a valid value' });
      }
      // Hago un update del cart , enviando el products y el cid
      const up=await cartsM.updateCart (products, cid);
      console.log('Product updated successfully',up);
      return res.status(200).send({ status: 'success', message: 'Product updated successfully' });
    } catch (error) {
      console.log('Error:', error);
      return res.status(400).send({ status: 'failed', message: 'Product could not be updated' });
    }
})

export default router;