const mongoose = require('mongoose')

// const orderShema = new mongoose.Schema({
//     userId:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:'User',
//         required:true
//     },
//     shippingAddress:{
//         fullname:{
//             type:String,
//             required:true
//         },
//         mobile:{
//             type:Number,
//             required:true
//         },
//         address:{
//             type:String,
//             required:true
//         },
//         pincode:{
//             type:Number,
//             required:true
//         },
//         city:{
//             type:String,
//             required:true
//         },
//         state:{
//             type:String,
//             required:true
//         }
//     },
//     products:[{
//         productId:{
//             type:mongoose.Schema.Types.ObjectId,
//             ref:'Product',
//             required:true
//         },
//         quantity:{
//             type:Number,
//             required:true

//         }

//     }],

//     orderStatus:{
//         type:String,
//         default:"Pending",
//         required:true
//     },
//     orderDate:{
//         type: Date,
//         default: Date.now
//     },
//     totalAmount:{
//         type:Number,
//         required:true
//     },
//     paymentMethod:{
//         type:String,
//         default:"Cash on delivery",
//         required:true
//     }

// })



const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  shippingAddress: {
    fullname: {
      type: String,
      required: true
    },
    mobile: {
      type: Number,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    pincode: {
      type: Number,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    }
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      unitPrice: {
        type: Number,
        require: true
      },
      ProductOrderStatus: {
        type: String,
        require: true
      },
      returnOrderStatus: {
        status: {
          type: String
        },
        reason: {
          type: String
        },
        date: {
          type: Date,
        }

      }
    }
  ],
  OrderStatus: {
    type: String,
    require: true
  },
  StatusLevel: {
    type: Number,
    //   required: true
  },
  // paymentStatus:{
  //   type:String,
  //   require:true
  // },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    require: true
  },
  // coupon:{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Coupon',
  // },
  // trackId:{
  //   type: String,
  //   require:true
  // },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model("Order", orderSchema)