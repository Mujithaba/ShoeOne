const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({

    code: {
        type: String,
        required: true
    },
    // couponName: {
    //     type: String,
    //     required: true
    // },
    validFrom: {
        type: String,
        required: true
    },
    expiry: {
        type: String,
        required: true
    },
    discountAmount: {
        type: Number,
        required: true
    },
    minimumCartValue: {
        type: Number,
        required: true
    },
    is_listed: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model("Coupon", couponSchema)