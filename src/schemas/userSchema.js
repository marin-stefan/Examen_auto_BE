import mongoose from "mongoose";
import bcrypt from "mongoose-bcrypt";
import roleSchema from "./roleSchema.js";


const userSchema = mongoose.Schema({
        _id: mongoose.Schema.Types.ObjectId,
        firstName: {
            type: String,
            required: true,
            trim: true,
            minLength: 2,
            maxLength: 15
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            minLength: 2,
            maxLength: 15
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        username: {
            type: String,
            required: true,
            trim: true,
            minLength: 4,
            maxLength: 15
        },
        password: {
            type: String,
            required: true,
            minLength: 8
        },
        roleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: roleSchema,
            required: [true, "Role id is required"],
        },
        totalExams: {
            type: Number,
            maxLength: 4
        },
        totalPassedExams: {
            type: Number,
            maxLength: 4
        },
        correctAnswers: {
            type: Number,
            maxLength: 8
        },
        wrongAnswers: {
            type: Number,
            maxLength: 8
        }

    },

    {
        toJSON: { virtuals: true },
        toObject: { virtuals: false },
        timeStamps: true         
    }
)

userSchema.plugin(bcrypt, {
    fields: ['password'],
    rounds: 10
});

userSchema.virtual('type', {
    ref: roleSchema,
    localField: 'roleId',
    foreignField: '_id',
    justOne: true
});

const User = mongoose.model('User', userSchema);

export default User;