import { Header, Gateway } from "encore.dev/api";
import { APIError } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

interface AuthParams {
    authorization: Header<"Authorization">;
}

interface AuthData {
    userID: string;
}

export const auth = authHandler<AuthParams, AuthData>(
    async (params) => {
        try {
            // Ambil token dari header Authorization
            const authHeader = params.authorization;
            if (!authHeader) {
                console.log("No authorization header found");
                throw APIError.unauthenticated("bad credentials");;
            }

            // Pastikan format Bearer token benar
            const [bearer, token] = authHeader.split(' ');
            if (bearer !== 'Bearer' || !token) {
                console.log("Invalid authorization format");
                throw APIError.unauthenticated("Bearer token not found");;
            }

            // Verifikasi JWT
            const decoded = jwt.verify(token, JWT_SECRET) as { userID: string };
            
            // Jika verifikasi berhasil, return data user
            return {
                userID: decoded.userID
            };

        } catch (error) {
            console.log(error);
            throw APIError.unauthenticated(`bad credentials ${error}`);
        }
    }
);

// Gateway definition
export const gateway = new Gateway({
    authHandler: auth,
});