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
import { sendResetPasswordMail, sendVerificationMail } from "../utils/sendMail";
import crypto from "crypto";
import { envConfig } from "../configs/env";
import jwt from "jsonwebtoken"
import { logger } from "../utils/logger";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  // const userNamme = req.body.userName;
  const { userName, email, password, fullName, avatar } = handleZodError(
    validateRegisterData(req.body)
  );

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new CustomError(ResponseStatus.Conflict, "Email already registered");
  }

  logger.info("existingUser", existingUser)
  
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
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  console.log("at ", accessToken)
  console.log("rt ", refreshToken)

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

const logOutUser = asyncHandler(async ( req: Request, res: Response) =>{
    const { _id } = req.body.user;

    await User.findByIdAndUpdate(
      {_id}, 
      {
        refreshToken: undefined
      }
    )

    res.status(ResponseStatus.Success).clearCookie("accessToken").clearCookie("refreshToken").json(new ApiResponse(ResponseStatus.Success, {}, "logged out successfully"))

})

const forgotPassword = asyncHandler(async (req: Request, res: Response) =>{
  const {email} = req.body;
  if( !email ){
    throw new CustomError(ResponseStatus.BadRequest, "Missing required fields")
  }

  const user = await User.findOne({email})

  if( !user ) {
    throw new CustomError(ResponseStatus.NotFound, "User does not exits")
  }

  const {hashedToken, unHashedToken, tokenExpiry} = user.generateToken();
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpiry = tokenExpiry;

  await user.save();

  await sendResetPasswordMail(user.userName, user.email,unHashedToken );

  res.status(ResponseStatus.Success).json(new ApiResponse(
    ResponseStatus.Success, {}, "Rest link is sent to the provided email"
  ))

})

const resetPassword = asyncHandler(async (req: Request, res: Response) =>{
  const { password } = req.body;
  const {resetToken} = req.params;

  const user = await User.findOne({
    resetPasswordToken : resetToken,
    resetPasswordExpiry : { gt: new Date() }
  })

  if(!user){
    throw new CustomError(
      ResponseStatus.Unauthorized, " Token is invalid or expired "
    )
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;
  await user.save();

  res.status(ResponseStatus.Success).json( new ApiResponse(ResponseStatus.Success, {}, "Password reset successfully") );

})

const refreshAccessToken = asyncHandler(async (req , res ) =>{
  const incomingRefreshToken = req.cookies.refreshAccessToken;

  if(!incomingRefreshToken){
    throw new CustomError(ResponseStatus.Unauthorized, "Unauthorized request")
  }

  let decodedToken : any;
  try {
    decodedToken = jwt.verify(incomingRefreshToken, envConfig.REFRESH_TOKEN_SECRET)
  } catch (error) {
    throw new CustomError( ResponseStatus.BadRequest, "Invalid jwt token ")
  }

  const user = await User.findOne({ email: decodedToken.email });

  if( !user ){
    throw new CustomError(ResponseStatus.Unauthorized, "Invalid token")
  }

  if (user.refreshToken !== incomingRefreshToken) {
    throw new CustomError(
      ResponseStatus.Forbidden,
      "Refresh token has been used or is invalid"
    );
  }

  let accessToken ; 
  let refreshToken; 

  user.refreshToken = refreshToken;
  await user.save();

  const cookieOptions = {
    httpOnly: true,
    samesite: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  }

  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(200, {}, "Access token refreshed successfully"));

})


export { registerUser, verifyUser, resendVerificationEmail, loginUser, logOutUser, forgotPassword, resetPassword,refreshAccessToken };