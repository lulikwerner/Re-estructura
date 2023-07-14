import mongoose from "mongoose";

const collection = "Tickets";

const schema = new mongoose.Schema(
    {
      code: String, //autogenerarse y ser unico
      purchase_datetime: { createdAt: 'created_at', updatedAt: 'updated_at'},
      amount: Number,
      purchaser: String,
    },
   
  );

const userModel = mongoose.model(collection,schema);
export default userModel;