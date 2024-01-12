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

    wallet: {
        balance: {
            type: Number,
            required: true,
            default: "0"
        },
        history: [
            {
                type: {
                    type: String,

                },
                amount: {
                    type: Number,

                },
                reason: {
                    type: String,

                },
                date: {
                    type: Date,
                    default: Date.now()
                }
            }
        ],
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
    }

});

module.exports = mongoose.model("User", userSchema);