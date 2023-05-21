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
        const cart =( { products: products });
        const createdCart = await cartModel.create(cart);
        return createdCart;
      };



        updateCart = async (pid, cid, qty) => {
            const cart = await cartModel.findById(cid).populate('products.product');
            console.log(cid);
            // Find the product in the array of cart products
            const product = cart.products.find((product) => product.pid === pid);
            console.log(pid);
            // Find the index of the product in the products array
            const index = cart.products.findIndex((product) => product.pid === pid);
            if (index !== -1) {
              // If it exists, update the quantity
              cart.products[index].qty += Number(qty);
            } else {
              // If it doesn't exist, create a new entry with the provided quantity
              cart.products.push({ pid: new mongoose.Types.ObjectId(pid), qty: Number(qty) });
            }
            await cart.save(); // Save the updated cart
            console.log('Product added successfully');
          };
          
    
       /* await cartModel.updateOne(
            {_id:cid},
            {$push:{products: {product: new mongoose.Types.ObjectId(pid)}}});
       // const cart = await cartModel.find().populate('products.product');
        console.log(JSON.stringify(cart,null,'\t'))*/
    };

