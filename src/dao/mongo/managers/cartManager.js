  import cartModel from "../models/carts.js";
  import productModel from "../models/products.js";
  import mongoose from "mongoose";

  export default  class CartManager {
      //Obtiene todos los carts
      getCarts = async() => {
    const populatedCart = await cartModel.find().populate('products.product').lean();;
    //console.log(JSON.stringify(populatedCart, null, '\t'));
    return populatedCart;  
      };
      //Obtiene un Cart por ID
      getCartBy = async (params) => {
          const populatedCart = await cartModel.findById(params).populate('products.product').lean();
          //console.log(JSON.stringify(populatedCart, null, '\t'));
          return populatedCart
      };
      //Crea un cart
      createCart = async (products) => {
        try {

          const cart = new cartModel();
          const productIds = products.map(product => product._id);
          const productsToAdd = await productModel.find({ _id: { $in: productIds } });
          for (const product of productsToAdd) {
            const matchingProduct = products.find(p => p._id.toString() === product._id.toString());
            if (matchingProduct) {
              cart.products.push({ product: product._id, quantity: matchingProduct.qty });
            }
          }
          await cart.save();
          return cart;
        } catch (error) {  
          throw new Error('Failed to create the cart');
        }
      };
      
      //Actualiza la cantidad en un cart
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

      updateProductsInCart = async (cartId, products) => {
        try {
          const cart = await cartModel.findById(cartId).populate('products.product');
      
          if (!cart) {
            return null; // Cart not found
          }
      
          let updatedCart = null; // Initialize updatedCart
      
          products.forEach((product) => {
            const productId = product.pid;
            console.log(productId);
            const cartProduct = cart.products.find((cartProduct) => cartProduct.product.id === productId);
            if (cartProduct) {
              // Product exists in the cart, update the fields
              const { title, description, code, price, stock, category, thumbnails } = product;
      
              if (title) {
                cartProduct.product.title = title;
              }
              if (description) {
                cartProduct.product.description = description;
              }
              if (code) {
                cartProduct.product.code = code;
              }
              if (price) {
                cartProduct.product.price = price;
              }
              if (stock) {
                cartProduct.product.stock = stock;
              }
              if (category) {
                cartProduct.product.category = category;
              }
              if (thumbnails) {
                cartProduct.product.thumbnails = thumbnails;
              }
            }
          });
          try {
            updatedCart = await cart.save(); // Intenta guardar el carrito actualizado
            console.log(JSON.stringify(updatedCart, null, '\t'));
            console.log(JSON.stringify(updatedCart, null, '\t'));
          
            return updatedCart;
          } catch (error) {
            console.error('Error al guardar el carrito:', error);
            // Maneja el error de acuerdo a tus necesidades (por ejemplo, registra un mensaje de error, devuelve una respuesta de error, etc.)
          }
         
          
      
          return updatedCart;
        } catch (error) {
          // Handle the error
        }
      };
      
      updateQtyCart = async (cid, pid, qty) => {
      try {
        const cart = await cartModel.findById(cid).populate('products.product');
        const productIndex = cart.products.findIndex((p) => p.product._id.equals(pid));
        if (productIndex !== -1) {
          cart.products[productIndex].product.stock = qty;
          const updatedProduct = await cart.products[productIndex].product.save();
          return updatedProduct;
        } else {
          throw new Error('Product not found in cart');
        }
      } catch (error) {
        throw error;
      }
      }

      deleteCart = async (cid) => {
      return cartModel.findByIdAndDelete(cid)
      }
    
      deleteProductInCart = async (cid, products) => {
    try {
        return await cartModel.findOneAndUpdate(
            { _id: cid },
            { products },
            { new: true })

    } catch (err) {
        return err
    }
      }

      emptyCart = async (cid)=> {
    try {
      if (!mongoose.Types.ObjectId.isValid(cid)) {
        throw new Error('Invalid cart ID');
      }

      const updatedCart = await cartModel.findByIdAndUpdate(
        cid,
        { $set: { products: [] } },
        { new: true }
      );
      console.log(JSON.stringify(updatedCart, null, '\t'));
      return updatedCart;
    } catch (error) {
      return error;
    }
      }

  
  
  

  
  
  
  
  
  /*updateQtyCart = async (cid, pid, qty) => {
    try {
      console.log('hola');
      console.log(cid);
      console.log(pid);
      const updatedCart = await cartModel.findOneAndUpdate(
        { _id: cid },
        { $set: { 'products.$[elem].product.stock': qty } },
        { new: true, arrayFilters: [{ 'elem.product': mongoose.Types.ObjectId(pid) }] }
      ).populate('products.product').lean();
      console.log('chau');
      console.log('Updated cart:', updatedCart);
      return updatedCart;
    } catch (error) {
      return error;
    }
  };*/
  


};
