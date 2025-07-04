import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Document, Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
import { envConfig } from "../configs/env";
import ms from "ms";

interface Avatar {
    url: string;
    localPath: string;
}

export interface IUser extends Document {
    // feilds related to the user
    // these are stored in DB
    userName: string;
    email: string;
    password: string;
    fullName?: string;
    avatar?: Avatar;
    isEmailVerified?: boolean;
    provider?: string;

    // feilds related to email and password verification and reset
    // these are also stord in DB
    emailVerificationToken?: string;
    emailVerificationExpiry?: Date;
    resetPasswordToken?: string;
    resetPasswordExpiry?: Date;
    refreshToken?: string;

    // methods for User that we use on User Document
    // These are not stored in Db
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
    generateToken(): {
        hashedToken: string;
        unHashedToken: string;
        tokenExpiry: Date;
    };
}

const userSchema = new mongoose.Schema<IUser>(
    {
        userName: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: function (this: IUser) {
                return this.provider === "local";
            },
            trim: true,
        },
        fullName: {
            type: String,
            trim: true,
        },
        avatar: {
            type: {
                url: { type: String, default: "https://api.dicebear.com/8.x/pixel-art/svg?seed=Ram123" },
                localPath: { type: String, default: "" },
            },
            set: function (value: any) {
                if (typeof value === "string") {
                    return { url: value, localPath: "" };
                }
                return value;
            },
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        provider: {
            type: String,
            default: "local",
        },

        emailVerificationToken: String,
        emailVerificationExpiry: Date,

        resetPasswordToken: String,
        resetPasswordExpiry: Date,

        refreshToken: String,
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
    const accessToken = jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.userName,
        },
        envConfig.ACCESS_TOKEN_SECRET,
        {
            // Only allow string values that look like valid time durations.
            expiresIn: envConfig.ACCESS_TOKEN_EXPIRY as ms.StringValue,
        }
    );
    return accessToken;
};

userSchema.methods.generateRefreshToken = async function () {
    const refreshToken = jwt.sign(
        {
            _id: this.id,
            email: this.email,
            userName: this.userName,
        },
        envConfig.REFRESH_TOKEN_SECRET,
        {
            expiresIn: envConfig.REFRESH_TOKEN_EXPIRY as ms.StringValue,
        }
    );
    return refreshToken;
};

userSchema.methods.generateToken = function () {
    const unHashedToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
        .createHash("sha256")
        .update(unHashedToken)
        .digest("hex");
    const tokenExpiry = new Date(Date.now() + 20 * 60 * 1000);

    return { unHashedToken, hashedToken, tokenExpiry };
};

const User = mongoose.model("User", userSchema);
export { User };
