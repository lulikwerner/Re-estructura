import mongoose from "mongoose";

const collection = "Users";

const schema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  age: Number,
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Carts",
  },
  role: {
    type: String,
    enum: ["ADMIN", "USER", "PREMIUM"],
    default: "USER",
  },
  documents: {
    type: [
      {
        name: String,
        reference: String,
      },
    ],
  },
  last_connection: {
    type: Date,
    default: Date.now,
  },
});
const userModel = mongoose.model(collection, schema);
export default userModel;
