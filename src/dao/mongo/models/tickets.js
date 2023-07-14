import mongoose from "mongoose";

const collection = "Tickets";

const schema = new mongoose.Schema(
    {
      code: String, //autogenerarse y ser unico
      amount: Number,
      purchaser: String,
    },
    {
      purchase_datetime: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
  );

const ticketModel = mongoose.model(collection,schema);
export default ticketModel;