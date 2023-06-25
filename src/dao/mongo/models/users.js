import mongoose from "mongoose";

const collection = "Users";

const schema = new mongoose.Schema({
    first_name:String,
    last_name:String,
    email:String,
    password:String,
    age:Number,
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Carts'
    },
    role:{
            type:String,
            default:"user"
    } 
})

const userModel = mongoose.model(collection,schema);
export default userModel;





