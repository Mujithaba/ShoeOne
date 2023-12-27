const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [
        {
            productId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity:{
                type:Number,
                default:1,
                min:1,
                max:10
            }
        }
    ],
    // totalPrice:{
    //     type: Number,
    //     required: true
    // },
    createdAt:{
        type:Date,
        default:Date.now,
        required:true
    },
    updatedAt: {
        type:Date,
        default:Date.now,
        required:true
    }
});

module.exports = mongoose.model("Cart",cartSchema)