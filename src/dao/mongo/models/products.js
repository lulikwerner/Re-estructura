import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const collection = 'products';

const schema = new mongoose.Schema(
  {
    title: String,
    description: String,
    code: String,
    price: Number,
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    stock: Number,
    category: String,
    thumbnail: {
      type: Array, // Use Array instead of []
      default: ['No image'], // Provide a default value
    },
    owner:{
      type: String,
      default: 'adminCoder@coder.com',
    } 
  },

  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

schema.plugin(mongoosePaginate);

const productModel = mongoose.model(collection, schema);
export default productModel;
