import { Router } from 'express';
import CartManager from "../dao/mongo/managers/cartManager.js";
import mongoose from "mongoose"


const router = Router();
const cartsM = new CartManager();

//Agrega producto al carrito
router.post('/', async (req, res) => {
    const cart = req.body;
    try {
        if (!Array.isArray(cart)) {
        return res.status(400).send({ status: 'error', message: 'Cart should be an array' });
        }
      // Check if any product is incomplete or has invalid values
        for (const product of cart) {
            if (isNaN(product.qty)) {
                return res.status(400).send({ status: 'error', message: 'Enter valid values for all products' });
        }
            if (!product.pid || !product.qty) {
                return res.status(400).send({ status: 'error', message: 'One or more fields are incomplete for a product' });
        }
        }
      // Create the cart and add all the products to it
        const createdCart = await cartsM.createCart({ products: cart });
        if (!createdCart) {
            return res.status(400).send({ status: 'error', message: 'Failed to create the cart' });
        }
        return res.send({ status: 'success', cart: createdCart });
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
    const pidNumber = parseInt(pid);
    try {
        // Valido que el valor para el product id sea mayor a cero y un numero
        console.log('pidNumber:', pidNumber);
    
        if (isNaN(pidNumber) || pidNumber < 0) {
            console.log('Invalid values');
            return res.status(400).send({ status: 'error', message: 'Please enter a valid value' });
        }
        // Valido que entre una cantidad
        if (!qty) {
            console.log('Quantity is missing');
            return res.status(400).send({ status: 'error', message: 'Please enter a quantity' });
        }
        // Valido que el valor que se envía como qty sea un número y mayor a 0
        if (isNaN(qty) || qty < 0) {
            console.log('Invalid quantity');
            console.log('qty:', qty);
            console.log('typeof qty:', typeof qty);
            return res.status(400).send({ status: 'error', message: 'Quantity should be a valid value' });
        }
        const cart = await cartsM.getCartBy({ _id: mongoose.Types.ObjectId(cid) });
        // Busco el producto en el array de carrito
        const index = cart.products.findIndex(product => product.pid == pid);
        if (index !== -1) {
            // Si está, le sumo las cantidades
            cart.products[index].qty += Number(qty);
        } else {
            // Si no está, lo creo con las cantidades
            cart.products.push({ pid: pidNumber, qty: Number(qty) });
        }
        await cartsM.updateCart(cid, cart);
        console.log('Product added successfully');
        return res.status(200).send({ status: 'success', message: 'Product added successfully' });
    } catch (error) {
        console.log('Error:', error);
        return res.status(400).send({ status: 'failed', message: 'Product could not be added' });
    }
});



export default router;