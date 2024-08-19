const mongoose = require("mongoose")
const Schema = mongoose.Schema

const User = new Schema({

    firstName: {
        type: String,
        require: true
    },

    lastName: {
        type: String,
        require: true
    },

    email: {
        type: String,
        require: true
    },

    password: {
        type: String,
        require: true
    },

    hierarchy: {
        type: Number,
        default: 0,
        require: true
    },
    
    createdAt: {
        type: Date,
        default: Date.now()
    }
    
})

mongoose.model("users", User)