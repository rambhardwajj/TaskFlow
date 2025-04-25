import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import { envConfig } from "../configs/env";
import { CustomError } from "./CustomError";
import { ResponseStatus } from "./constants";

var mailGenerator = new Mailgen({
  theme: "default",
  product: {
    // Appears in header & footer of e-mails
    name: "PMS",
    link: envConfig.APP_URL,
  },
});

// this function takes 3 params
// email -> user se aaegi
// Subject -> user se aaegi
// content -> content hame ek function se milega jo function email ka content bana ta hai via mailgen
const sendMail = async (
  email: string,
  subject: string,
  content: Mailgen.Content
) => {
  // transporter email ko serve krta hai
  const transporter = nodemailer.createTransport({
    host: envConfig.MAILTRAP_HOST,
    port: envConfig.MAILTRAP_PORT,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: envConfig.MAILTRAP_USERNAME,
      pass: envConfig.MAILTRAP_PASSWORD,
    },
  });

  const html = mailGenerator.generate(content);
  const text = mailGenerator.generatePlaintext(content);
  try {
    const info = await transporter.sendMail({
      from: envConfig.MAILTRAP_SENDERMAIL, // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      text, // plain text body
      html, // html body
    });
    // console.log(info)
  } catch (error) {
    throw new CustomError(
      ResponseStatus.InternalServerError,
      "Cannot send mail"
    );
  }
};

// this construct the email. Takes username and link as args.
const constructVerifcationEmailContent = (username: string, link: string) => {
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

// mailgen
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

const sendVerificationMail = async (
  userName: string,
  email: string,
  token: string
) => {

  // email ke button pe ye link hogi 
  const link = `${envConfig.APP_URL}/api/v1/user/verify/${token}`;
  const content = constructVerifcationEmailContent(userName, link)

  await sendMail( email, "Verify email", content );
};

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

export { sendVerificationMail, sendResetPasswordMail };
