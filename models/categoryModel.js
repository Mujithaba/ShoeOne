const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({

    categoryName: {
        type: String,
        required: true
    },
    is_listed: {
        type: Boolean,
        default:true
    }

});

module.exports = mongoose.model("Category",categorySchema)