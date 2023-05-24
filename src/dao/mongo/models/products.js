import mongoose from "mongoose";

const collection = "products";

const schema = new mongoose.Schema({
    title:String,
    description:String,
    code:String,
    price: Number,
    status:{
        type:String,
        enum:["Active","Inactive"],
        default: "Active"
    } ,
    stock: Number,
    category:String,
    thumbnail:{
        type:[],
        default: "No image "
    } 
},
{timestamps:{createdAt: 'created_at', updatedAt: 'updated_at'}}
);

const productModel = mongoose.model(collection,schema);
export default productModel;