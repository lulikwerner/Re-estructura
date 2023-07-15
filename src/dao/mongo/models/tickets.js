import mongoose from "mongoose";

const collection = "Tickets";

const schema = new mongoose.Schema(
  {
    code: String,
    amount: Number,
    purchaser: String,
    purchase_datetime: {
      type: Date,
      default: Date.now,
    },
  }
);

const ticketModel = mongoose.model(collection, schema);
export default ticketModel;
