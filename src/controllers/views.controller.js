import { productService, cartService } from '../services/index.js';
import productModel from '../dao/mongo/models/products.js';


const  realTimeProducts = async (req, res) => {
    const products = await productService.getProductsService();
    res.render('realTimeProducts', { producth: products });
};

const getProducts = async (req, res) => {
    const { limit, page = 1, sort, category } = req.query;
  
    try {
    const user = req.user;
      console.log('en la ruta', user)
      if (limit) {
        const products = await productService.getProductsService();
  
        if (limit < 0 || isNaN(limit)) {
          return res.sendBadRequest('Please enter a valid value for limit.' );
        }
        const limitedProducts = products.slice(0, limit); 
        return res.render('home', { producth: limitedProducts, user: user });
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
        console.log(response);
        return res.render('home', { producth, hasPrevPage, hasNextPage, prevPage, nextPage, ...rest, user: user});
      }
  
      const products = await productService.getProductsService();
      const { categories, statuses } = await  productService.categoriesAndStatusService();
      console.log('entro en categoria'); // Retrieve categories and statuses
      console.log('el usuario', user);
      return res.render('home', { producth: products, categories, statuses, user: user });
    } catch (error) {
      console.error(error);
      return res.sendInternalError ('An internal server error occurred.' );
    }
};
  
const chat = async(req,res)=>{
    res.render('chat');
};

const productsInCart = async(req,res)=>{
    const { cid } = req.params;
    const carts = await cartService.getCartByIdService(cid);
    console.log(JSON.stringify(carts, null, '\t'));
    res.render('cart',{carth:carts} );
};

const register = async(req,res)=>{
    res.render('register');
};

const login = async(req,res)=>{
    res.render('login');
};
  
const profile = (req,res) => {
    const user = req.user;
    res.render('profile', {user} )
};

export default {
    realTimeProducts,
    getProducts,
    chat,
    productsInCart,
    register,
    login,
    profile
}