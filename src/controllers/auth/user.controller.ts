import crypto from "crypto";
import jwt from "jsonwebtoken";
import { User } from "models/auth/user.models";
import { Request, Response } from 'express';
// Assuming UserDocument is the type for documents returned by mongoose
import { ApiError } from "utils/ApiError";
import { asyncHandler } from "utils/asyncHandler";
import { ApiResponse } from "utils/ApiResponse";
import { emailVerificationMailgenContent, sendEmail } from "utils/mail";

interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

const generateAccessAndRefreshToken = async (userId: string): Promise<TokenPair> => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const accessToken: string = user.generateAccessToken();
        const refreshToken: string = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating the access token"
        );
    }
};

const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({
        $or: [{ username }, { email }],
    });
    if (existingUser) {
        throw new ApiError(409, "User with email or username already exists", []);
    }

    const user = await User.create({
        email,
        password,
        username,
        isEmailVerified: false,
        role,
    });

    const { unHashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;
    await user.save({ validateBeforeSave: false });

    await sendEmail({
        email: user.email,
        subject: "Please verify your email",
        mailgenContent: emailVerificationMailgenContent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`
        ),
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res
        .status(201)
        .json(
            "USer registration was successfull and verification email has been sent on your email.",
        );
});

export { registerUser, generateAccessAndRefreshToken };
