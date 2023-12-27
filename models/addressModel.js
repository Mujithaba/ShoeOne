const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    fullname: {
        type: String,
        required: true
    },
    mobile:{
        type:String,
        required:true
    },
    address:{
        type:String
    },
    pincode:{
        type:String
    },
    city:{
        type:String
    },
    state:{
        type:String
    }
});

module.exports = mongoose.model("Address",addressSchema)