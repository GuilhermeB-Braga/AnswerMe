const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Quiz = new Schema({

    name: {
        type: String,
        require: true
    },

    theme: {
        type: String,
        require: true
    },
    
    description: {
        type: String,
        require: true
    },

    date: {
        type: String,
    },
    
    author: {
        type:mongoose.SchemaTypes.ObjectId,
        ref: "quizzes",
        require: true
    }

})

mongoose.model("quizzes", Quiz)