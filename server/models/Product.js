import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a product description'],
    },
    category: {
      type: String,
      required: [true, 'Please add a product category'],
    },
    brand: {
      type: String,
      required: [true, 'Please add a product brand'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a product price'],
      default: 0.0,
    },
    stock: {
      type: Number,
      required: [true, 'Please add product stock quantity'],
      default: 0,
    },
    image: {
      type: String,
      required: [true, 'Please add an image URL'],
      default: '/images/sample.jpg',
    },
    rating: {
      type: Number,
      required: true,
      default: 0.0,
    },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
