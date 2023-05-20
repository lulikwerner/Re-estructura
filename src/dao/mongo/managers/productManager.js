import productModel from "../models/products.js";

export default  class ProductManager {

    getProducts = () => {
        return productModel.find();
    };
    
    getProductBy = (params) => {
        return productModel.findOne(params);
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