import { Router } from "express";
import productManager from "../dao/mongo/managers/productManager.js";


const router = Router();
const product = new  productManager ();


router.get('/', async(req, res) => {
  const product = await  productManager.getProducts;
  res.render('realTimeProducts');
});

router.get('/chat',async(req,res)=>{
  res.render('chat');
})


export default router;
