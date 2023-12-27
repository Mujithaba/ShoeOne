const mongoose = require('mongoose');
const { array } = require('../multer');

const productSchema = mongoose.Schema({

   productName: {
      type: String,
      required: true
   },

   Price: {
      type: Number,
      required: true
   },

   productSize: {
      type: String,
      required: true
   },

   image: {
      type: Array,
      required: true,
      //  validate:[arrayLimit,'You can pass only 4 product images']
   },

   description: {
      type: String,
      required: true
   },

   stock: {
      type: Number,
      required: true
   },

   category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category"
   },

   ratings: {
      star: Number,
      comment: String,
      postdby: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
   },

   is_listed: {
      type: Boolean,
      required: true
   },
},
   { timestamps: true });

// function arrayLimit(val) {
//    return val.arrayLimit <=4 ;
// }

module.exports = mongoose.model("Product", productSchema)