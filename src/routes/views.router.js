import { Router } from "express";
import productManager from "../dao/mongo/managers/productManager.js"
import cartManager from "../dao/mongo/managers/cartManager.js"
import productModel from "../dao/mongo/models/products.js";

const router = Router();
const product = new  productManager ();
const cart = new cartManager();


router.get('/realTimeProducts', async(req, res) => {
  const products = await  product.getProducts();
  res.render('realTimeProducts',products);
});

router.get('/',async(req,res)=>{
  const {page=1} = req.query
  const{docs, hasPrevPage, hasNextPage, prevPage, nextPage,...rest} = await productModel.paginate({},{page,limit:10,lean:true})
const producth =docs;
res.render('home',{producth,hasPrevPage, hasNextPage, prevPage, nextPage,page:rest.page});
})




router.get('/chat',async(req,res)=>{
  res.render('chat');
})

router.get('/cart/:cid',async(req,res)=>{
  const { cid } = req.params;
  const carts = await cart.getCartBy(cid);
  console.log(JSON.stringify(carts, null, '\t'));
  res.render('cart',{carth:carts} );
})


router.get("/realTimeCart/:cid", async (req, res) => {
  res.render("realTimeCart");
});

export default router;
