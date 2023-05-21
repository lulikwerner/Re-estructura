import cartModel from "../models/carts.js";
import productModel from "../models/products.js";
import mongoose from "mongoose";

export default  class CartManager {

    getCarts = () => {
        return cartModel.find();
    };
    
    getCartBy = (params) => {
        return cartModel.findOne(params);
    };

    // Create a new cart with the specified products
createCart = async (products) => {
    try {
      const cart = new cartModel();
      
      for (const { pid, qty } of products) {
        const product = await productModel.findById(pid);
        
        if (product) {
          cart.products.push({ product: product._id, quantity: qty });
        }
      }
      
      await cart.save();
      
      return cart;
    } catch (error) {
      throw new Error('Failed to create the cart');
    }
  }
  
  // Update an existing cart with additional products
  updateCart = async (cartId, products) => {
    try {
      const cart = await cartModel.findById(cartId);
      
      for (const { pid, qty } of products) {
        const product = await productModel.findById(pid);
        
        if (product) {
          const existingProduct = cart.products.find(p => p.product.equals(product._id));
          
          if (existingProduct) {
            existingProduct.quantity += qty;
          } else {
            cart.products.push({ product: product._id, quantity: qty });
          }
        }
      }
      
      await cart.save();
      
      return cart;
    } catch (error) {
      throw new Error('Failed to update the cart');
    }
  }
  
}
    
       /* await cartModel.updateOne(
            {_id:cid},
            {$push:{products: {product: new mongoose.Types.ObjectId(pid)}}});
       // const cart = await cartModel.find().populate('products.product');
        console.log(JSON.stringify(cart,null,'\t'))*/
    

