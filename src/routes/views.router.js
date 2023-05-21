import { Router } from "express";
import productManager from "../dao/mongo/managers/productManager.js"


const router = Router();
const product = new  productManager ();


router.get('/realTimeProducts', async(req, res) => {
  const products = await  product.getProducts();
  res.render('realTimeProducts',products);
});

router.get('/home',async(req,res)=>{
  const products = await product.getProducts().lean();
  console.log(products)
  res.render('home',{producth:products});
})


router.get('/chat',async(req,res)=>{
  res.render('chat');
})


export default router;
