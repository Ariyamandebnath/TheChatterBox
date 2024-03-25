import crypto from "crypto";
import jwt from "jsonwebtoken";
import { User, IUser } from "models/auth/user.models"; // Assuming UserDocument is the type for documents returned by mongoose
import { ApiError } from "utils/ApiError";
import { asyncHandler } from "utils/asyncHandler";
import { ApiResponse } from "utils/ApiResponse";

interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

const generateAccessAndRefreshToken = async (userId: string): Promise<TokenPair> => {
    try {
        const user: IUser | null = await User.findById(userId);
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

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, role } = req.body;

    const exitstedUser = await User.findOne({
        $or: [{username}, {email}],
    })
    if (exitstedUser) {
        throw new ApiError(409, "User with email or username already exits ", []);
    }
    const user = await User.create({
        email,
        password,
        username,
        isEmailVerified: false,
        role: role
    });


    const { unhassedToken, hashedToken, tokenExpiry } = user.generateTemporaryAccessToken();


})

export { registerUser, generateAccessAndRefreshToken };
