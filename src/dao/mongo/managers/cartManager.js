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

updateCart = async (products, cid) => {
    try {
        //Busco el carrito
        const cart = await cartModel.findById(cid);
        for (const { pid, qty } of products) {
            console.log('Product:', pid);
            console.log('el cart', cid);
     //Busco el producto
        const product = await productModel.findById(pid);
        console.log('Found product:', product);
        //Si el producto existe busco si esta en el cart
        if (product) {
          const existingProduct = cart.products.find(p => p.product.equals(product._id));
          //Si esta en el cart le sumo las cantidades
          if (existingProduct) {
            existingProduct.quantity += qty;
          } else {
            console.log('antes del push');
            const newProduct = { product: product._id, quantity: qty };
            cart.products.push(newProduct);
            console.log('Added product:', newProduct);
          }
        }
      }
  
      console.log('despues del push');
      await cart.save();
      console.log('Updated cart:', cart);
      return cart;
    } catch (error) {
      console.log('Error:', error);
      throw new Error('Failed to update the cart');
    }
  };
  
  
  
};
    
       /* await cartModel.updateOne(
            {_id:cid},
            {$push:{products: {product: new mongoose.Types.ObjectId(pid)}}});
       // const cart = await cartModel.find().populate('products.product');
        console.log(JSON.stringify(cart,null,'\t'))*/
    

