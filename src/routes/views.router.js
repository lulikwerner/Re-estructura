import { Router } from "express";
import productManager from '../managers/productManager.js';

const router = Router();
const ProductManager = new productManager();

router.get('/', (req, res) => {
  res.render('realTimeProducts');
});


/*router.post('/api/realtimeProducts', async (req, res) => {
  const product = req.body;
  await ProductManager.addProduct(product);
  const products = await ProductManager.getProducts();
  res.render('realTimeProducts', { products });
});*/

export default router;
