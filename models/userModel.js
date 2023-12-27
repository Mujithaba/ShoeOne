const mongoose = require('mongoose')

const userSchema = mongoose.Schema({

    firstName: {
        type: String,
        require: true
    },
    secondName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    mobile: {
        type: Number,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    is_admin: {
        type: Number,
        require: true
    },
    is_verified: {
        type: Number,
        default: 0
    },
    is_blocked: {
        type: Boolean,
        default: 0
    },
    token:{
        type: String,
        default:''
    }

});

module.exports = mongoose.model("User", userSchema);