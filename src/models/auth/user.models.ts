import mongoose, { Schema, Document } from "mongoose";
import { AvailableUserRoles, UserRolesEnum } from "../../constants";

// Define an interface for the User document
interface UserDocument extends Document {
    avatar: {
        url: string;
        localPath: string;
    };
    username: string;
    email: string;
    role: keyof typeof UserRolesEnum;
    password: string;
    loginType: string; // You need to define AvailableSocialLogins and UserLoginType interfaces
    isEmailVerified: boolean;
    refreshToken?: string;
    forgotPasswordToken?: string;
    forgotPasswordExpiry?: Date;
    emailVerificationToken?: string;
    emailVerificationExpiry?: Date;
}

// Define the schema fields
const userSchemaFields: Record<keyof UserDocument, any> = {
    avatar: {
        type: {
            url: String,
            localPath: String,
        },
        default: {
            url: `https://via.placeholder.com/200x200.png`,
            localPath: "",
        },
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
        enum: Object.values(UserRolesEnum),
        default: UserRolesEnum.USER,
        required: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    loginType: {
        type: String,
        enum: [], // You need to define AvailableSocialLogins and UserLoginType interfaces
        default: "", // You need to define default value
    },
    isEmailVerified: {
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
    emailVerificationToken: {
        type: String,
    },
    emailVerificationExpiry: {
        type: Date,
    },
};

// Create the Mongoose schema
const userSchema = new Schema<UserDocument>(userSchemaFields, { timestamps: true });

// Define and export the User model
export const User = mongoose.model<UserDocument>("User", userSchema);
