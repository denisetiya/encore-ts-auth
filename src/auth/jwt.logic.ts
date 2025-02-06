import prisma from "../utils/prisma";
import jwt from "jsonwebtoken"; // Ubah cara import
import * as crypto from "crypto";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

// Validasi environment variables
const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.JWT_SECRET;

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
    throw new Error('JWT_SECRET must be defined in environment variables');
}

interface UserData {
    id: string;
    email: string;
}

// Generate access token (short-lived)
export const generateAccessToken = (user: UserData): string => {
    try {
        return jwt.sign(
            {
                userID: user.id,
                email: user.email
            },
            ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );
    } catch (error) {
        console.error('Error generating access token:', error);
        throw error;
    }
};

// Generate refresh token (long-lived)
export const generateRefreshToken = async (user: UserData): Promise<string> => {
    try {
        const refreshToken = jwt.sign(
            {
                userID: user.id,
                email: user.email
            },
            REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );

        // Store refresh token in database

        await prisma.refreshToken.upsert({
            where :{ userId: user.id },
            update : { token: refreshToken },
            create : { userId: user.id, token: refreshToken , expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}
        });

        return refreshToken;
    } catch (error) {
        console.error('Error generating refresh token:', error);
        throw error;
    }
};

// Verify token utility function
export const verifyToken = (token: string, isRefresh = false): any => {
    try {
        return jwt.verify(token, isRefresh ? REFRESH_TOKEN_SECRET : ACCESS_TOKEN_SECRET);
    } catch (error) {
        console.error('Token verification failed:', error);
        throw error;
    }
};