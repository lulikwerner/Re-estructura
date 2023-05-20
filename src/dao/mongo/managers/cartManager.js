import cartModel from "../models/carts.js";
import mongoose from "mongoose";

export default  class CartManager {

    getCarts = () => {
        return cartModel.find();
    };
    
    getCartBy = (params) => {
        return cartModel.findOne(params);
    };

    createCart = async (cart,pid) => {
       const createdCart = await cartModel.create(cart);
        await cartModel.updateOne(
            {_id:createdCart._id },
            {$push:{products: {product: new mongoose.Types.ObjectId(pid)}}});
        const populatedCart = await cartModel.findById(createdCart._id ).populate('products.product');
        console.log(populatedCart)
        console.log(JSON.stringify(populatedCart, null, '\t'));
        return populatedCart;
      };
      

      
          
      
    updateCart = async (pid, cid) => {
        await cartModel.updateOne(
            {_id:cid},
            {$push:{products: {product: new mongoose.Types.ObjectId(pid)}}});
        const cart = await cartModel.find().populate('products.product');
        console.log(JSON.stringify(cart,null,'\t'))
    };

}