import { Response, Request } from "express";
import { User } from "../models/user.models";
import { asyncHandler } from "../utils/asyncHandler";
import {
  validateLoginData,
  validateRegisterData,
} from "../validators/user.validations";
import { ResponseStatus } from "../utils/constants";
import { CustomError } from "../utils/CustomError";
import { ApiResponse } from "../utils/ApiResponse";
import { handleZodError } from "../utils/handleZodErrors";
import { uploadOnCloudinary } from "../configs/cloudinary";
import { sendVerificationMail } from "../utils/sendMail";
import crypto from "crypto";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  // const userNamme = req.body.userName;
  const { userName, email, password, fullName, avatar } = handleZodError(
    validateRegisterData(req.body)
  );

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new CustomError(ResponseStatus.Conflict, "Email already registered");
  }

  // console.log(req.file);
  let user = await User.create({ email, password, userName, avatar, fullName });

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

  // req.file mai se avatar ka local path nikalo , req.file hame multer se milega
  const avatarLocalPath = req.file?.path;
  let avatarUrl;
  if (avatarLocalPath) {
    // upload the image assets on cloudinary
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

  res
    .status(200)
    .json(
      new ApiResponse(
        ResponseStatus.Success,
        {},
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

  res
    .status(ResponseStatus.Success)
    .json(
      new ApiResponse(ResponseStatus.Success, {}, "Email verified successfully")
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

    const { hashedToken, tokenExpiry, unHashedToken } = user.generateToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;

    // this will
    await sendVerificationMail(user.userName, user.email, unHashedToken);

    res
      .status(ResponseStatus.Success)
      .json(
        new ApiResponse(
          ResponseStatus.Success,
          {},
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

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new CustomError(ResponseStatus.Unauthorized, "Invalid credentials");
  }

  // generating access n refresh token
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  
  await user.save();

  res
    .status(ResponseStatus.Success)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
    })
    .json(new ApiResponse(ResponseStatus.Success, {}, "Login successful"));
});

export { registerUser, verifyUser, resendVerificationEmail, loginUser };
