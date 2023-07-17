import productModel from "../models/products.js";


export default class ProductManager {

    categoriesAndStatus = async () => {
    try {
      const categoriesData = await productModel.aggregate([
        {
          $group: {
            _id: null,
            categories: { $addToSet: "$category" },
            statuses: { $addToSet: "$status" }
          }
        }
      ]);
console.log(categoriesData)
      const { categories, statuses } = categoriesData[0];
      return { categories, statuses };
    } catch (err) {
      console.log(err);
      return err;
    }
  };

    getProducts = () => {
        return productModel.find().lean();
    };
    
    getProductBy = (params) => {
        return productModel.findOne(params).lean();
    };

    createProduct = async (product) => {
        return  productModel.create(product);
 
    };

    updateProduct= async (id, update) => {
      try {
        const updatedProduct = await productModel.findByIdAndUpdate(id, update, { new: true });
        return updatedProduct;
      } catch (error) {
        console.log('Error updating product:', error);
        throw error;
      }
    };
    
    deleteProduct = (id) => {
        return productModel.findByIdAndDelete(id);
    };
}


