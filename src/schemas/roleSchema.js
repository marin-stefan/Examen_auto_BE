import mongoose from "mongoose";
import UserRolesEnum from "../enums/userRolesEnum.js"

const roleSchema = mongoose.Schema({
        _id: mongoose.Schema.Types.ObjectId,
        name: {
            type: String,
            enum: [UserRolesEnum.Admin, UserRolesEnum.Consumer],
            required: true
        },
    },
    {
        timestamps: true,
        toJson: { virtuals: true },
        toObject: { virtuals: true }
    }
)

const Role = mongoose.model('Role', roleSchema);

export default Role