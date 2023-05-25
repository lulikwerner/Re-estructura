import { Router } from "express";
import productManager from "../dao/mongo/managers/productManager.js"
import cartManager from "../dao/mongo/managers/cartManager.js"
import productModel from "../dao/mongo/models/products.js";
import categoriesAndStatus from "../dao/mongo/managers/productManager.js"

const router = Router();
const product = new  productManager ();
const cart = new cartManager();


router.get('/realTimeProducts', async(req, res) => {
  const products = await  product.getProducts();
  res.render('realTimeProducts',products);
});


router.get('/realTimeProducts', async (req, res) => {
  const products = await product.getProducts();
  res.render('realTimeProducts', { producth: products });
});

router.get('/', async (req, res) => {
  const { limit, page = 1, sort, category } = req.query;

  try {
    if (sort) {
      let sortedProducts = 'desc';
      if (sort === 'desc') {
        sortedProducts = await productModel.find().sort({ price: -1 }).limit(limit).lean();
      } else {
        sortedProducts = await productModel.find().sort({ price: 1 }).limit(limit).lean();
      }
      return res.render('home', { producth: sortedProducts });
    }

    if (limit) {
      const products = await product.getProducts();

      if (limit < 0 || isNaN(limit)) {
        return res.status(400).send({ status: 'error', message: 'Please enter a valid value for limit.' });
      }
      const limitedProducts = products.slice(0, limit);
      return res.render('home', { producth: limitedProducts });
    }

    if (page) {
      const query = category ? { category } : {}; 
      const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, ...rest } = await productModel.paginate(query, { page, limit: 10, lean: true });
      const producth = docs;
      
     
      return res.render('home', { producth, hasPrevPage, hasNextPage, prevPage, nextPage, ...rest });
    }

    const products = await product.getProducts();
    const { categories, statuses } = await categoriesAndStatus(); 
    console.log('entro en categoria')// Retrieve categories and statuses
    return res.render('home', { producth: products, categories, statuses }); 
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: 'error', message: 'An internal server error occurred.' });
  }
});






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
