import Mailgen from "mailgen"
import nodemailer from "nodemailer"
import { envConfig } from "../configs/env";
import { CustomError } from "./CustomError";
import { ResponseStatus } from "./constants";


var mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        // Appears in header & footer of e-mails
        name: 'PMS',
        link: ""
    }
});

const sendMail= async (email: string, subject: string, content : Mailgen.Content)=>{
    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: envConfig.PORT,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: envConfig.MAILTRAP_USERNAME,
          pass: envConfig.MAILTRAP_PASSWORD ,
        },
    });

    const html = mailGenerator.generate(content);
    const text = mailGenerator.generatePlaintext(content );
    try {
        const info = await transporter.sendMail({
            from: envConfig.MAILTRAP_SENDERMAIL, // sender address
            to: email, // list of receivers
            subject: subject , // Subject line
            text, // plain text body
            html // html body
        });
    } catch (error) {
        throw new CustomError( "Cannot send mail", ResponseStatus.InternalServerError )
    }
}

const emailVerificationMailContent = (username: string, link: string) => {
    return {
      body: {
        name: username,
        intro: "Welcome to Task Manager! We're thrilled to have you.",
        action: {
          instructions: "Click below to verify your email:",
          button: {
            color: "#22BC66", // Optional action button color
            text: "Verify Email",
            link: link,
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };
  };
  
  const resetPasswordMailContent = (username: string, link: string) => {
    return {
      body: {
        name: username,
        intro: "It seems like you requested a password reset.",
        action: {
          instructions: "Click below to reset your password:",
          button: {
            color: "#FF613C", // Optional action button color
            text: "Reset Password",
            link: link,
          },
        },
        outro: "If you didn’t request this, you can ignore this email.",
      },
    };
  };

const sendVerificationMail = async (userName: string, email:string, token: string)=>{
    const link = `${envConfig.APP_URL}/api/v1/user/verify/${token}`

    await sendMail(email , "Verify email",emailVerificationMailContent(userName, link) )
}

const sendResetPasswordMail = async (
    username: string,
    email: string,
    token: string
  ) => {
    const link = `${envConfig.APP_URL}/api/v1/user/reset-password/${token}`;
  
    await sendMail(
      email,
      "Reset Your Password",
      resetPasswordMailContent(username, link)
    );
  };

  export {sendVerificationMail, sendResetPasswordMail}