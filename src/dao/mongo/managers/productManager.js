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

    updateProduct = (id, product) => {
        return productModel.findByIdAndUpdate(id,{$set:product});
    };

    deleteProduct = (id) => {
        return productModel.findByIdAndDelete(id);
    };
}


