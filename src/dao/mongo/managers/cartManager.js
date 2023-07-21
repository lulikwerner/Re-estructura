import cartModel from "../models/carts.js";
import productModel from "../models/products.js";
import mongoose from "mongoose";

export default class CartManager {
  //Obtiene todos los carts
  getCartBy = async (params) => {
    const populatedCart = await cartModel
      .findById(params)
      .populate('products.product')
      .lean();


    // Calculate the quantity for each product in the cart
    const cartWithQuantity = populatedCart.products.map((productEntry) => {
      const quantity = productEntry.quantity || 1; // Use a default quantity of 1 if the quantity field is not present
      const product = productEntry.product;
      return {
        product,
        quantity,
      };
    });

    populatedCart.products = cartWithQuantity;
    // console.log(JSON.stringify(populatedCart, null, '\t'));
    return populatedCart;
  };

  //Obtiene un Cart por ID
  getCartById = async (params) => {
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

  //Actualiza los productos del cart con el POST
  updateQtyCart = async (cid, products, quantity) => {
    try {
      //Busco el carrito
      const cart = await cartModel.findById(cid);
      console.log('el cart', cart)
      //Si no existe el carrito
      if (!cart) {
        throw new Error(`The ID cart: ${cid} not found`);
      }
      const [product] = [products];
      const { _id: productId } = product; {

        //Busco el producto
        const product = await productModel.findById(productId);
        //Si el producto existe:
        if (product) {
          /*const NewQty = product.quantity += quantity
          console.log(product.quantity)
            console.log(quantity)
          console.log('lacantidad',NewQty )
          //Si la cantidad que estoy agregando es mayor al stock del producto. Arrojo error
          if (NewQty > product.stock) {
            throw {
              message: 'There is not enough stock',
              statusCode: 400, 
            };
          }  */
          const existingProduct = cart.products.find(p => p.product.equals(product._id));
          console.log('elexistingproduct', existingProduct)
          //Si existe en el cart y la cantidad total no excede al stock
          if (existingProduct) {
            existingProduct.quantity += quantity;
          }
          //Si no existe en el cart lo agrego
          if (!existingProduct) {
            const newProduct = { product: product._id, quantity: 1 };
            cart.products.push(newProduct);
            console.log('Added product:', newProduct);
          }
        }
      }
      await cart.save();
      return cart;
    } catch (error) {
      console.log('Error:', error);
      throw new Error('Failed to update the cart');
    }
  };

  //Actualiza aca toque cartID
  updateProductsInCart = async (cid, products) => {
    try {
      const cart = await cartModel.findById(cid).populate('products.product');
      // Cart not found
      if (!cart) {
        return null;
      }

      products.forEach(async (product) => {
        const productId = product._id.toString();
        console.log('Product ID:', productId);
        console.log('elcart', cart);

        const cartProduct = cart.products.find((cartProduct) => cartProduct.product._id.toString() === productId);
        console.log('estaono', cartProduct);
        if (cartProduct) {
          const updateFields = ['title', 'description', 'code', 'price', 'status', 'stock', 'category', 'thumbnails'];

          updateFields.forEach((field) => {
            if (product[field] !== undefined) {
              cartProduct.product[field] = product[field];
              console.log(`Updated ${field}:`, product[field]);
            }
          });

          // Save the updated product
          await cartProduct.product.save();
          console.log('enelmanager', cartProduct);
        }
      });

      await cart.save();

      return cart;
    } catch (error) {
      throw error;
    }
  };

  //Actualiza la cantidad en un cart
  updateCart = async (cid, pid, qty) => {
    try {
      const cart = await cartModel.findById(cid).populate('products.product');
      console.log('cartt', cart)
      const productIndex = cart.products.findIndex((p) => p.product._id.equals(pid));
      if (productIndex !== -1) {
        //Si la nueva cantidad  es mayor al stock del producto. Arrojo error
        if (qty > cart.products[productIndex].product.stock) {
          throw {
            message: 'There is not enough stock',
            statusCode: 400,
          };
        }
        cart.products[productIndex].quantity = qty;
        await cart.save();
        return cart.products[productIndex].product;
      } else {
        throw new Error('Product not found in cart');
      }
    } catch (error) {
      throw error;
    }
  }

  //Elimina el carrito. No lo estoy usando
  deleteCart = async (cid) => {
    return cartModel.findByIdAndDelete(cid)
  }

  //Borra el producto del carrito
  deleteProductInCart = async (cid, productIdToDelete) => {
    try {
      const cart = await cartModel.findById(cid);
      if (!cart) {
        throw new Error("Cart not found");
      }

      // Busco el index
      const productIndex = cart.products.findIndex(product => product.product.toString() === productIdToDelete.toHexString());

      if (productIndex !== -1) {
        // Remove the product from the array
        cart.products.splice(productIndex, 1);
      }
      const updatedCart = await cart.save();
      return updatedCart;
    } catch (err) {
      return err;
    }
  }

  //Vacia el carrito
  emptyCart = async (cid) => {
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
  updateOneProductInCart = async (cid, cart) => {
    const updatedCart = await cartModel.findByIdAndUpdate(
      cid,
      {
        products: cart.map(product => ({ product, quantity: product.quantity })), //recorro el cart y traigo el producto y su cantidad
      },
      { new: true }
    ).populate('products.product').lean();

    console.log(JSON.stringify(updatedCart, null, '\t'));
    return updatedCart;
  };













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
