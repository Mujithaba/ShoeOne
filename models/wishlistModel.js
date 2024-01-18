const mongoose = require('mongoose')

const wishlistSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    products: [
      {
        productId:{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
      },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  });

  module.exports = mongoose.model('Wishlist',wishlistSchema)