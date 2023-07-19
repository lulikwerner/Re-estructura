// checkoutTicket.model.js
import mongoose from 'mongoose';

const collection = 'CheckoutTickets'; // Choose a collection name

const schema = new mongoose.Schema({
  cid:String,
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tickets', // Use the actual model name for the Tickets schema
  },
  InCart: {
    type: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        name: String,
        price: Number,
        quantity: Number,
        subtotal: Number,
      }
    ],
    default: []
  },
  Outstock: {
    type: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        name: String,
        price: Number,
        name: String,
        price: Number,
        quantity: Number,
      }
    ],
    default: []
  },
});

schema.pre('find', function() {
  this.populate('ticket');
});
  

const checkoutTicketModel = mongoose.model(collection, schema);
export default checkoutTicketModel;
