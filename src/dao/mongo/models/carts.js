import mongoose from 'mongoose';

const collection = 'Carts';

const schema = new mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'products' // Use the actual model name here
        },
        quantity: {
          type: Number,
          default: 1,
        },
      }
    ],
    default: []
  }
});

schema.pre('find',function(){
  this.populate('products.product');
})

const cartModel = mongoose.model(collection, schema);
export default cartModel;

