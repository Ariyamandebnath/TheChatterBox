import mongoose, { Schema, Document } from "mongoose";
import { AvailableUserRoles, UserRolesEnum } from '../../constants';
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import crypto from "crypto";


// Define user schema
const userSchema = new Schema({
    avatar: {
        type: {
            url: String,
            localPath: String,
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
        enum: Object.values(UserRolesEnum),
        default: UserRolesEnum.USER,
        required: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
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
    }
}, { timestamps: true });

// Define pre-save middleware to hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    } catch (error: any) {
        next(error);
    }
});

//Define an instance method for checking if the password is correct
userSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

// Define instance method for generating access token
userSchema.methods.generateAccessToken = function (): string {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET || '',
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};


//Define method for generating Refres Access Token
userSchema.methods.generateRefreshToken = function (): string {
    return jwt.sign({
        _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET || '',
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};

//Method that generates token for email verification password reset etc.
userSchema.methods.generateTemporaryToken = function (): { unHashedToken: string, hashedToken: string, tokenExpiry: number } {
    
    const USER_TEMPORARY_TOKEN_EXPIRY = 20 * 60 * 1000; // 20 minutes in milliseconds

    // Generate unhashed token
    const unHashedToken = crypto.randomBytes(20).toString("hex");

    // Generate hashed token This will stay in DB to compare at the time of verification
    const hashedToken = crypto
        .createHash("sha256")
        .update(unHashedToken)
        .digest("hex");

    // Calculate token expiry time
    const tokenExpiry = Date.now() + USER_TEMPORARY_TOKEN_EXPIRY;

    return { unHashedToken, hashedToken, tokenExpiry };
};

// Create and export User model
export const User = mongoose.model('User', userSchema);
