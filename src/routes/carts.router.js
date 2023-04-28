import { Router } from 'express';
import cartManager from '../../managers/cartManager.js';


const router = Router();
const CartManager = new cartManager();


router.get('/:cid', async (req, res) => {
    const { cid } = req.params
    try {
    //Busco el carrito por el id que le estoy enviando
        const resultCart = await CartManager.getCartsById(Number(cid))
    //Si no lo encuentra arrojo error
        if (!resultCart) return res.status(400).send({ status: 'error', message: 'Cart not found' })
    //Si lo encuentra lo traigo
        return res.status(200).send({ resultCart });
    } 
    catch (error) {
        console.log(error)
    }
});

router.post('/', async (req, res) => {
    try {
        const cart = req.body
        if(isNaN(cart.pid) || isNaN(cart.qty)) res.status(400).send({ status: 'error', message: 'Enter a valid value' });
    //Si no me envian el product id o el qty le arrojo error
        if (!cart.pid || !cart.qty) res.status(400).send({ status: 'error', message: 'Error! one or more fields are incomplete' });
       
    //Si todo esta ok agrego al carrito    
        const addedCart = await CartManager.addCart(cart);
        console.log(addedCart)
        if (!addedCart) return res.status(400).send({ status: 'error', message: 'Product not found' });
        return res.status(200).send({ addedCart });
    }
    catch (err) {
        console.log(err);
    }
});


router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { qty } = req.body;
        if (!qty || isNaN(qty)) {
            return res.status(400).send({ status: 'error', message: 'Quantity should be a valid number' });
        }
        const cart = await CartManager.getCartsById(parseInt(cid));
        const index = cart.products.findIndex(product => product.pid == pid);
        if (index !== -1) {
            cart.products[index].qty += Number(qty);
        } else {
            cart.products.push({ pid: Number(pid), qty: Number(qty) });
        }
        await CartManager.updateCart(cid, cart);
        return res.status(200).send({ status: 'success', message: 'Product added successfully' });
    } catch (error) {
        return res.status(400).send({ status: 'failed', message: 'Cart not found' });
    }
});







export default router;