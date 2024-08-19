const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Question = new Schema({

    question: {
        type: String,
        require: true
    },

    quiz: {
        type:mongoose.SchemaTypes.ObjectId,
        ref: "questions",
        require: true
    },

    answer: {
        type: String,
        require: true
    },

    alternative_a: {
        type: String,
        require: true
    },

    alternative_b: {
        type: String,
        require: true
    },

    alternative_c: {
        type: String,
        require: true
    },

    alternative_d: {
        type: String,
        require: true
    },

    date: {
        type: Date,
        default: Date.now()
    }
    
})

mongoose.model("questions", Question)