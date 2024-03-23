import mongoose, { Schema, Document } from "mongoose";
import { AvailableUserRoles, UserRolesEnum } from "../../constants";

const userSchema = new mongoose.Schema({
    avatar: {
        avatar: {
            type: {
                url: String,
                localPath :String,
            },
            default: {
                url: `https://fakeimg.pl/200x200`,
                localPath: "",
            }
        },
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        role: {
            type: String,
            enum: AvailableUserRoles,
            default: UserRolesEnum.USER,
            required: true
        },
        password: {
            type: String,
            required:[true, "password is required"],
        },
        isEmailVerfied: {
            type: Boolean,
            default: false,
        },
        refreshToken: {
            type: String,
        },
        forgotPasswordToken: {
            type: String,
        },
        forgotPasswordExpiry: {
            type: Date,
        },
        emailVarificationToken: {
            type: String,
        },
        emailVerificationExpiry: {
            type : Date,
        }

    }
},{ timestamps: true })

// Create the Mongoose schema
export const User = mongoose.model('User', userSchema)