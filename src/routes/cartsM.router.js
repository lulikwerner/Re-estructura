import { Router } from 'express';
import CartManager from "../dao/mongo/managers/cartManager.js";
import mongoose from "mongoose"


const router = Router();
const cartsM = new CartManager();

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
    const cidNumber = parseInt(cid);
    try {
      // Chequeo que el numero de carrito sea mayor a 0
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
    const products = [{ pid, qty }];
   ;
    try {
        //Si no se encuentra el carrito
        if (!cid) { console.log('Cart not found');
            return;}
      // Validate the product ID value
      console.log('cid',cid)
      console.log('pidNumber:', pid);

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
  


export default router;