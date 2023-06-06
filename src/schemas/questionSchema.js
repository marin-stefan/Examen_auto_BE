import mongoose from "mongoose";

const questionSchema = mongoose.Schema({
        _id: mongoose.Schema.Types.ObjectId,
        name: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        answers: {
            type: String,
            required: true
        },
        correct: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
        toJson: { virtuals: true },
        toObject: { virtuals: true }
    }
)

const Question = mongoose.model('Question', questionSchema);

export default Question