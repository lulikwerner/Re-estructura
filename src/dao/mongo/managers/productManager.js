import productModel from "../models/products.js";

export default  class ProductManager {

    /*categories = async () => {
        try {
            const categories = await productModel.aggregate([
                {
                    $group: {
                        _id: null,
                        categories: { $addToSet: "$category" }
                    }
                }
            ])

            return categories[0].categories

        }
        catch (err) {
            console.log(err);
            return err
        }

    }*/


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