import cartModel from "../models/carts.js";
import productModel from "../models/products.js";
import mongoose from "mongoose";

export default  class CartManager {

    getCarts = async() => {
   const populatedCart = await cartModel.find().populate('products.product').lean();;
   console.log(JSON.stringify(populatedCart, null, '\t'));
   return populatedCart;  
    };
    
    getCartBy = async (params) => {
        //return cartModel.findOne(params);
        console.log('entro')
        const populatedCart = await cartModel.findById(params).populate('products.product');
        console.log(JSON.stringify(populatedCart, null, '\t'));
        return populatedCart
    };


   /* createCart = async () => {
      return  cartModel.create();

  };

  updateCart = async (id, product) => {
    try {
      //Busco el carrito
      const cart = await cartModel.findById(cid);
      if(!cart){}
      for (const { pid, qty } of products) {
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
          const newProduct = { product: product._id, quantity: qty };
          cart.products.push(newProduct);
          console.log('Added product:', newProduct);
        }
      }
    }
    await cart.save();
    console.log('Updated cart:', cart);
    return cart;
  } catch (error) {
    console.log('Error:', error);
    throw new Error('Failed to update the cart');
  }

      return productModel.findByIdAndUpdate(id,{$set:product});
  };*/

  createCart = async (products) => {
        try {
            const cart = new cartModel();
            for (const { pid, qty } of products) {
              //Busco el pid en  coleccion de productos
            const product = await productModel.findById(pid);
            //Si existe el producto empujo la cantidad y el id
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
            const newProduct = { product: product._id, quantity: qty };
            cart.products.push(newProduct);
            console.log('Added product:', newProduct);
          }
        }
      }
      await cart.save();
      console.log('Updated cart:', cart);
      return cart;
    } catch (error) {
      console.log('Error:', error);
      throw new Error('Failed to update the cart');
    }
  };
  
  deleteCart=(cid)=>{
    return cartModel.findByIdAndDelete(cid)
  }
  
};


    
       /* await cartModel.updateOne(
            {_id:cid},
            {$push:{products: {product: new mongoose.Types.ObjectId(pid)}}});
       // const cart = await cartModel.find().populate('products.product');
        console.log(JSON.stringify(cart,null,'\t'))*/
    

