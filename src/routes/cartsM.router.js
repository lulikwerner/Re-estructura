import { Router } from 'express';
import CartManager from "../dao/mongo/managers/cartManager.js";
import mongoose from "mongoose"


const router = Router();
const cartsM = new CartManager();

//Agrega producto al carrito
router.post('/', async (req, res) => {
    const products = req.body;
    try {
      // Create the cart
     const createdCart = await cartsM.createCart(products);
      console.log(createdCart)
      if (!createdCart) {
        return res.status(400).send({ status: 'error', message: 'Failed to create the cart' });
      }
      return res.status(200).send({ status: 'succes', message: 'create the cart' });
      // Add products to the cart
      /*for (const product of cart) {
        const { pid, qty } = product;
        await cartsM.updateCart(pid, createdCart._id, qty);
      }
  
      // Fetch the updated cart with populated products
      const updatedCart = await cartsM.getCartById(createdCart._id);
  
      return res.send({ status: 'success', cart: updatedCart });*/
    } catch (err) {
      console.log(err);
      res.status(500).send({ status: 'error', message: 'Internal server error' });
    }
  });
  



router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    const cidNumber = parseInt(cid);
    try {
      // Check if cid is a valid positive number
        if (cidNumber < 0 || isNaN(cidNumber)) {
        return res.status(400).send({ status: 'error', message: 'Please enter a valid id' });
        }
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
    const { qty } = req.body;
   ;
    try {
        if (!cid) {
            // If cart is not found, return an error or handle the situation accordingly
            console.log('Cart not found');
            return;
          }
      // Validate the product ID value
      console.log('cid',cid)
      console.log('pidNumber:', pid);

      // Validate the quantity
      if (!qty) {
        console.log('Quantity is missing');
        return res.status(400).send({ status: 'error', message: 'Please enter a quantity' });
      }
      // Validate the quantity value
      if (isNaN(qty) || qty < 0) {
        console.log('Invalid quantity');
        console.log('qty:', qty);
        console.log('typeof qty:', typeof qty);
        return res.status(400).send({ status: 'error', message: 'Quantity should be a valid value' });
      }
      // Update the cart
      await cartsM.updateCart(pid, cid, qty);
      console.log('Product added successfully');
      return res.status(200).send({ status: 'success', message: 'Product added successfully' });
    } catch (error) {
      console.log('Error:', error);
      return res.status(400).send({ status: 'failed', message: 'Product could not be added' });
    }
  });
  


export default router;