import mongoose from "mongoose";

const collection = "Carts";

const schema = new mongoose.Schema({
  
    products: {
   
        type:[
            {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products'
        }
    }
],
default:[]
    }
});

const cartModel = mongoose.model(collection, schema);
export default cartModel;
