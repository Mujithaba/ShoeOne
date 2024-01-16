const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({

    categoryName: {
        type: String,
        required: true
    },
    offers:[{
        offerName :{
           type:String
        },
        discountOffer:{
           type: Number
        },
        typeOfOffer :{
           type:String
       },
        expiry:{
           type:Date,
          
        }
     }],
    is_listed: {
        type: Boolean,
        default:true
    }

});

module.exports = mongoose.model("Category",categorySchema)