const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({

    offerName: {
        type: String,
        required: true
    },
 
    validFrom: {
        type: String,
        required: true
    },
    expiry: {
        type: String,
        required: true
    },
    typeOfOffer :{
        type:String
    },
    discountOffer: {
        type: Number,
        required: true,
        min: 0,
        max: 100, // Assuming your discountOffer is a percentage, so it should be between 0 and 100.
    },
  
    is_listed: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model("Offer", offerSchema)