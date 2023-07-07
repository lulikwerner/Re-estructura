  import cartModel from "../models/carts.js";
  import productModel from "../models/products.js";
  import mongoose from "mongoose";

  export default  class CartManager {
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
      updateCart = async (products, cid) => {
        console.log('los prosss',products)
    try {
        //Busco el carrito
        const cart = await cartModel.findById(cid);
       
        const [{ _id: productId }] = products; {
          console.log('es el pid a actualziar',productId)
    //Busco el producto
        const product = await productModel.findById(productId);
        console.log('Found product:', product);
        //Si el producto existe busco si esta en el cart
        if (product) { 
          const existingProduct = cart.products.find(p => p.product.equals(product._id));
          //Si esta en el cart le sumo las cantidades
          console.log('elstock',product.stock)
          if (existingProduct) {
            existingProduct.quantity += 1;
          } else {
            const newProduct = { product: product._id, quantity: 1};
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

      //Actualiza aca toque cartID
      updateProductsInCart = async (cid, products) => {
        try {
          const cart = await cartModel.findById(cid).populate('products.product');
      
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
            if (updatedCart.isNew) {
              console.log('El carrito fue guardado correctamente y es nuevo');
            } else {
              console.log('El carrito fue guardado correctamente y se actualizó');
            }
            return updatedCart;
          } catch (error) {
            console.error('Error al guardar el carrito:', error);
            // Maneja el error de acuerdo a tus necesidades (por ejemplo, registra un mensaje de error, devuelve una respuesta de error, etc.)
          }
          /*Copy code
          const cartIndex = carts.findIndex(c => c.cid === parseInt(cid));

          if (cartIndex === -1) {
          throw new Error(`We cannot make an update to the cart with id ${cid} because it does not exist`);
          }

          const cartToUpdate = { ...carts[cartIndex], ...updatedCart };
          carts[cartIndex] = cartToUpdate;*/
          return updatedCart;
        } catch (error) {
          throw error;
        }
      };

       //Actualiza la cantidad en un cart
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

      //Elimina el carrito. No lo estoy usando
      deleteCart = async (cid) => {
      return cartModel.findByIdAndDelete(cid)
      }
    
      //Borra el producto del carrito
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

      //Vacia el carrito
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
