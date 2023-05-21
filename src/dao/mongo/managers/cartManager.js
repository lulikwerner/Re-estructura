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

    createCart = async (cart,pid) => {

       /* const cart = new cartModel();

        const products = await productModel.find({ _id: { $in: pid } });
        const productRefs = products.map(product => ({ product: product._id }));
        cart.products = productRefs;
        await cart.save();*/

        const newCart = await cartModel.create(pid)
       await cartModel.updateOne(
            {_id:cid},
            {$push:{products: {product: new mongoose.Types.ObjectId(pid)}}});
        //const cart = await cartModel.find().populate('products.product');
        /*const newCart = new cartModel({
            products:[]
        }) 
        return newCart.save()*/
    }
      

      
    updateCart = async (pid, cid) => {
        await cartModel.updateOne(
            {_id:cid},
            {$push:{products: {product: new mongoose.Types.ObjectId(pid)}}});
       // const cart = await cartModel.find().populate('products.product');
        console.log(JSON.stringify(cart,null,'\t'))
    };

}