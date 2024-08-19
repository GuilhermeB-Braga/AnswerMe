const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Answer = new Schema({
    userId: mongoose.SchemaTypes.ObjectId,
    quizId: mongoose.SchemaTypes.ObjectId,
    totalErr: Number,
    points: Number,
    userAnswer: [{
        questionId: [mongoose.SchemaTypes.ObjectId],
        answer: [String],
    }]
})

mongoose.model("answers", Answer)