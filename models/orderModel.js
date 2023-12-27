const mongoose = require('mongoose')

const orderShema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    shippingAddress:{
        fullname:{
            type:String,
            required:true
        },
        mobile:{
            type:Number,
            required:true
        },
        address:{
            type:String,
            required:true
        },
        pincode:{
            type:Number,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        }
    },
    products:[{
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product',
            required:true
        },
        quantity:{
            type:Number,
            required:true

        }

    }],

    orderStatus:{
        type:String,
        default:"Pending",
        required:true
    },
    orderDate:{
        type: Date,
        default: Date.now
    },
    totalAmount:{
        type:Number,
        required:true
    },
    paymentMethod:{
        type:String,
        default:"Cash on delivery",
        required:true
    }

})

module.exports= mongoose.model("Order",orderShema)