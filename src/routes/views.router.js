import { Router } from "express";
import productManager from "../dao/mongo/managers/productManager.js"
import cartManager from "../dao/mongo/managers/cartManager.js"
import productModel from "../dao/mongo/models/products.js";
import categoriesAndStatus from "../dao/mongo/managers/productManager.js"

const router = Router();
const product = new  productManager ();
const cart = new cartManager();


router.get('/realTimeProducts', async (req, res) => {
  const products = await product.getProducts();
  res.render('realTimeProducts', { producth: products });
});

router.get('/products', async (req, res) => {
  const { limit, page = 1, sort, category } = req.query;

  try {
  
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
      const sortQuery = sort === 'desc' ? { price: -1 } : { price: 1 };
      const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, ...rest } = await productModel.paginate(query, { page, limit: 10, sort: sortQuery, lean: true });
      const producth = docs;
      const response = {
        status: 'success',
        payload: docs,
        totalPages: rest.totalPages,
        prevPage: prevPage,
        nextPage: nextPage,
        page: rest.page,
        hasPrevPage: hasPrevPage,
        hasNextPage: hasNextPage,
        prevLink: hasPrevPage ? `/?limit=${limit}&page=${prevPage}&sort=${sort}&category=${category}` : null,
        nextLink: hasNextPage ? `/?limit=${limit}&page=${nextPage}&sort=${sort}&category=${category}` : null
      };
     console.log(response)
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
