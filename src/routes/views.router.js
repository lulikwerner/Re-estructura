import { Router } from "express";
import productManager from "../dao/mongo/managers/productManager.js"
import cartManager from "../dao/mongo/managers/cartManager.js"


const router = Router();
const product = new  productManager ();
const cart = new cartManager();


router.get('/realTimeProducts', async(req, res) => {
  const products = await  product.getProducts();
  res.render('realTimeProducts',products);
});

router.get('/home',async(req,res)=>{
  const products = await product.getProducts()
  console.log(products)
  res.render('home',{producth:products});
})


router.get('/chat',async(req,res)=>{
  res.render('chat');
})

router.get('/cart',async(req,res)=>{
  const carts = await cart.getCarts();
  //console.log(carts)
  res.render('cart',{carth:carts} );
})

export default router;
