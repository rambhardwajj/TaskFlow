import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const createEnv = (envConfig: NodeJS.ProcessEnv) => {
  const envSchema = z.object({
    PORT: z.coerce.number(),
    MONGO_URI: z.string().nonempty(),

    MAILTRAP_HOST: z.string().nonempty(),
    MAILTRAP_PORT: z.coerce.number(),
    MAILTRAP_USERNAME: z.string().nonempty(),
    MAILTRAP_PASSWORD: z.string().nonempty(),
    MAILTRAP_SENDERMAIL: z.string().nonempty(),

    APP_URL: z.string(),
    DOMAIN_URL: z.string(),

    ACCESS_TOKEN_SECRET: z.string().nonempty(),
    ACCESS_TOKEN_EXPIRY: z.string().default("5m"),

    REFRESH_TOKEN_SECRET: z.string().nonempty(),
    REFRESH_TOKEN_EXPIRY: z.string().default("7d"),

    CLOUDINARY_NAME: z.string().nonempty(),
    CLOUDINARY_API_KEY: z.string().nonempty(),
    CLOUDINARY_SECRET_KEY: z.string().nonempty(),
  });

  const validationResult = envSchema.safeParse(envConfig);

  if (validationResult.success) {
    return validationResult.data;
  } else {
    const errorMessage = validationResult.error.errors
      .map((err) => `${err.path.join(".")} :  ${err.message}`)
      .join(", ");

    throw new Error(errorMessage);
  }
};

const envConfig = createEnv(process.env);
export { envConfig };