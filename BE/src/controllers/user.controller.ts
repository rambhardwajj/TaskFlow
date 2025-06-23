import { Response, Request } from "express";
import { User } from "../models/user.models";
import { asyncHandler } from "../utils/asyncHandler";
import {
    validateLoginData,
    validateRegisterData,
    validateUpdatePasswordData,
} from "../validators/user.validations";
import { ResponseStatus } from "../utils/constants";
import { CustomError } from "../utils/CustomError";
import { ApiResponse } from "../utils/ApiResponse";
import { handleZodError } from "../utils/handleZodErrors";
import { uploadOnCloudinary } from "../configs/cloudinary";
import { sendResetPasswordMail, sendVerificationMail } from "../utils/sendMail";
import crypto from "crypto";
import { envConfig } from "../configs/env";
import jwt from "jsonwebtoken";
import { logger } from "../utils/logger";
import { verifyGoogleToken } from "../utils/VerifyGoogleToken";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
    // const userNamme = req.body.userName;
    const { userName, email, password, fullName } = handleZodError(
        validateRegisterData(req.body)
    );

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new CustomError(
            ResponseStatus.Conflict,
            "Email already registered"
        );
    }

    logger.info("existingUser", existingUser);

    let user = await User.create({ email, password, userName, fullName });

    if (!user) {
        throw new CustomError(
            ResponseStatus.InternalServerError,
            "User registration failed"
        );
    }

    // in our interface the user already have generateToken function which generates
    const { hashedToken, tokenExpiry, unHashedToken } = user.generateToken();
    // emailverification token and expiry have to be set on user's document as it is important
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;
    user.isEmailVerified = false;

    // req.file mai se avatar ka local path nikalo , req.file hame multer se milega
    const avatarLocalPath = req.file?.path;
    let avatarUrl;
    if (avatarLocalPath) {
        avatarUrl = await uploadOnCloudinary(avatarLocalPath);
    }

    if (avatarUrl && avatarLocalPath) {
        user.avatar = {
            url: avatarUrl?.url,
            localPath: avatarLocalPath,
        };
    }

    await user.save();

    // sendVerificatioMail function  will send a verification email to the user at
    // []/api/v1/user/verify/token...
    await sendVerificationMail(user.userName, user.email, unHashedToken);

    res.status(200).json(
        new ApiResponse(
            ResponseStatus.Success,
            user,
            "User registered successfully. Please verify your email"
        )
    );
});

const verifyUser = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.params;
    if (!token) {
        throw new CustomError(
            ResponseStatus.BadRequest,
            "Verification token is required"
        );
    }

    // email verification token nikalo
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationExpiry: { $gt: new Date() },
    });

    if (!user) {
        throw new CustomError(
            ResponseStatus.Unauthorized,
            "Invalid or expired token"
        );
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;

    await user.save();

    res.status(ResponseStatus.Success).json(
        new ApiResponse(
            ResponseStatus.Success,
            user.isEmailVerified,
            "Email verified successfully"
        )
    );
});

const resendVerificationEmail = asyncHandler(
    async (req: Request, res: Response) => {
        const { email } = req.body;

        if (!email) {
            throw new CustomError(
                ResponseStatus.BadRequest,
                "Email address is required"
            );
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw new CustomError(
                ResponseStatus.Unauthorized,
                "No account found with this email address."
            );
        }

        if (user.isEmailVerified) {
            throw new CustomError(
                ResponseStatus.BadRequest,
                "Email is already verified"
            );
        }

        const { hashedToken, tokenExpiry, unHashedToken } =
            user.generateToken();

        user.emailVerificationToken = hashedToken;
        user.emailVerificationExpiry = tokenExpiry;

        // this will
        await sendVerificationMail(user.userName, user.email, unHashedToken);

        res.status(ResponseStatus.Success).json(
            new ApiResponse(
                ResponseStatus.Success,
                null,
                "Verification mail sent successfully. Please check your inbox"
            )
        );
    }
);

const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = handleZodError(validateLoginData(req.body));

    const user = await User.findOne({ email });
    if (!user) {
        throw new CustomError(ResponseStatus.NotFound, "User does not exist");
    }

    if (!user.isEmailVerified) {
        throw new CustomError(
            ResponseStatus.Unauthorized,
            "Email is not verified"
        );
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        throw new CustomError(
            ResponseStatus.Unauthorized,
            "Invalid credentials"
        );
    }

    // generating access n refresh token
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save();

    res.status(ResponseStatus.Success)
        .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        })
        .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        })
        .json(
            new ApiResponse(
                ResponseStatus.Success,
                {
                    user: {
                        _id: user._id,
                        fullName: user.fullName,
                        email: user.email,
                        userName: user.userName,
                        avatar: user.avatar,
                        provider: user.provider
                    },
                },
                "Login successful"
            )
        );
});

const logOutUser = asyncHandler(async (req: Request, res: Response) => {
    const { _id } = req.user;

    await User.findByIdAndUpdate(
        { _id },
        {
            refreshToken: undefined,
        }
    );

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 30 * 24 * 60 * 60 * 1000,
    })
        .clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        })
        .status(ResponseStatus.Success)
        .json(
            new ApiResponse(
                ResponseStatus.Success,
                null,
                "logged out successfully"
            )
        );
});

const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
        throw new CustomError(
            ResponseStatus.BadRequest,
            "Missing required fields"
        );
    }

    const user = await User.findOne({ email });

    if (!user ) { 
        throw new CustomError(ResponseStatus.NotFound, "User does not exits");
    }
    if( user.provider=="google"){
        throw new CustomError(ResponseStatus.Forbidden, "Google account cannot be reset");
    }

    const { hashedToken, unHashedToken, tokenExpiry } = user.generateToken();
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpiry = tokenExpiry;

    await user.save();

    await sendResetPasswordMail(user.userName, user.email, unHashedToken);

    res.status(ResponseStatus.Success).json(
        new ApiResponse(
            ResponseStatus.Success,
            null,
            "Reset link is sent to the provided email"
        )
    );
});

const resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { password } = req.body;
    const { resetToken } = req.params;

    const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
        throw new CustomError(
            ResponseStatus.Unauthorized,
            " Token is invalid or expired "
        );
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.status(ResponseStatus.Success).json(
        new ApiResponse(
            ResponseStatus.Success,
            {},
            "Password reset successfully"
        )
    );
});

const updatePassword = asyncHandler(async (req: Request, res: Response) => {
    console.log("in update password be");
    const { oldPassword, newPassword } = handleZodError( validateUpdatePasswordData(req.body))
    const { _id } = req.user;
    const user = await User.findById(_id);
    if (!user) {
        throw new CustomError(400, "User not found");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new CustomError(400, "Old password is incorrect");
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json(
        new ApiResponse(200, null, "Password Changed Successfully")
    );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken;

    if (!incomingRefreshToken) {
        throw new CustomError(
            ResponseStatus.Unauthorized,
            "Unauthorized request"
        );
    }

    let decodedToken: any;
    try {
        decodedToken = jwt.verify(
            incomingRefreshToken,
            envConfig.REFRESH_TOKEN_SECRET
        );
    } catch (error) {
        throw new CustomError(ResponseStatus.BadRequest, "Invalid jwt token ");
    }

    const user = await User.findOne({ email: decodedToken.email });

    if (!user) {
        throw new CustomError(ResponseStatus.Unauthorized, "Invalid token");
    }

    if (user.refreshToken !== incomingRefreshToken) {
        throw new CustomError(
            ResponseStatus.Forbidden,
            "Refresh token has been used or is invalid"
        );
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    const cookieOptions = {
        httpOnly: true,
        samesite: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    res.status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(200, null, "Access token refreshed successfully")
        );
});

const getUser = asyncHandler(async (req: Request, res: Response) => {
    const { _id } = req.user as { _id: string };

    const user = await User.findById(_id).select("-password");

    if (!user) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "User not found"));
    }

    res.status(200).json(
        new ApiResponse(
            200,
            {
                user: {
                    _id: user._id,
                    name: user.fullName,
                    email: user.email,
                    userName: user.userName,
                    avatar: {
                        url: user.avatar?.url,
                        loaclpath: user.avatar?.localPath,
                    },
                    provider: user.provider
                },
            },
            "User data retrieved successfully"
        )
    );
});

const googleLogin = asyncHandler(async (req: Request, res: Response) => {
    const { credential } = req.body;
    const payload = await verifyGoogleToken(credential);

    const { email, name, picture, email_verified } = payload;

    if (!email || !name || !picture || !email_verified) {
        throw new CustomError(400, "Invalid Google Information");
    }

    const existingUser = await User.findOne({
        email,
    });

    let user = existingUser;

    if (!user) {
        const baseUsername = email.split("@")[0];
        let username = baseUsername;
        const exiting = await User.findOne({ userName: username });
        if (exiting) {
            username = `${baseUsername}_${crypto.randomUUID().slice(0, 6)}`;
        }

        user = await User.create({
            email,
            fullName: name,
            isEmailVerified: email_verified,
            avatar: picture,
            userName: username,
            provider: "google",
        });
    }
    console.log(user)

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save();

    res.status(ResponseStatus.Success)
        .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        })
        .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        })
        .json(
            new ApiResponse(
                ResponseStatus.Success,
                {
                    user: {
                        _id: user._id,
                        fullName: user.fullName,
                        email: user.email,
                        userName: user.userName,
                        avatar: user.avatar,
                        provider: user.provider
                    },
                },
                "Google Login successful"
            )
        );
});

export {
    getUser,
    registerUser,
    verifyUser,
    resendVerificationEmail,
    loginUser,
    logOutUser,
    forgotPassword,
    resetPassword,
    refreshAccessToken,
    updatePassword,
    googleLogin
};
