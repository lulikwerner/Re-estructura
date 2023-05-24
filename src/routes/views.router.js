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

router.get('/cart/:cid',async(req,res)=>{
  const { cid } = req.params;
  const carts = await cart.getCartBy(cid);
  console.log(JSON.stringify(carts, null, '\t'));
 //res.render('cart',{carth:carts} );
})


router.get("/realTimeCart/:cid", async (req, res) => {
  const { cid } = req.params;
  const carts = await cart.getCartBy(cid);
  console.log(JSON.stringify(carts, null, '\t'));
  res.render('cart',{carth:carts} );
});

export default router;
