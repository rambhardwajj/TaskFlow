import { OAuth2Client } from "google-auth-library";
import { envConfig } from "../configs/env";
import { CustomError } from "./CustomError";

const client = new OAuth2Client(envConfig.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (credential: string) => {
    if (!credential) {
        throw new CustomError(400, "Google credential is required");
    }
    let payload;
    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: envConfig.GOOGLE_CLIENT_ID,
        });
        payload = ticket.getPayload();
    } catch (error) {
        throw new CustomError(400, "Invalid Google credential");
    }

    if (!payload) {
        throw new CustomError(400, "Google token verification failed, No payload received");
    }
    return payload;
};
