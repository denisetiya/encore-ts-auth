import { api } from "encore.dev/api";
import prisma from "../utils/prisma";
import { generateAccessToken, generateRefreshToken } from "./jwt.logic";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

// Ideally store these in environment variables
// const ACCESS_TOKEN_SECRET = "your-access-token-secret";
const REFRESH_TOKEN_SECRET = "your-refresh-token-secret";

interface LoginRequest {
    email: string;
    password: string;
}

interface RefreshRequest {
    refreshToken: string;
}



interface TokenResponse {
    status: 'success' | 'failed';
    token?: {
        accessToken: string;
        refreshToken: string;
    },
    data ?: any
    message?: string;
}

interface RegisterResponse {
    status: 'success' | 'failed';
    message?: string;
}


export const register = api<LoginRequest, RegisterResponse>({
    method: "POST",
    path: "/auth/register",
    expose: true
}, async (req) => {
    try {
        const hashedPassword = await bcrypt.hash(req.password, 10);
        const user = await prisma.user.create({
            data: {
                email: req.email,
                password: hashedPassword
            }
        });
        return {
            status: 'success',
            message: `User ${user.email} registered successfully`
        };
    } catch (error) {
        console.error('Register error:', error);
        return {
            status: 'failed',
            message: 'An error occurred during registration'
    }}
    
})

// Login endpoint
export const login = api<LoginRequest, TokenResponse>({
    method: "POST",
    path: "/auth/login",
    expose: true
}, async (req) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: req.email
            }
        });

        if (!user) {
            return {
                status: 'failed',
                message: 'Invalid email or password'
            };
        }

        // Verify password (use bcrypt.compare in production)
        const passwordMatch = await bcrypt.compare(req.password, user.password);
        if (!passwordMatch) {
            return {
                status: 'failed',
                message: 'Invalid email or password'
            };
        }

        // Generate both tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user);

        return {
            status: 'success',
            token : {
                accessToken,
                refreshToken
            },
            data : user
        };

    } catch (error) {
        console.error('Login error:', error);
        return {
            status: 'failed',
            message: 'An error occurred during login'
        };
    }
});

// Refresh token endpoint
export const refresh = api<RefreshRequest, TokenResponse>({
    method: "POST",
    path: "/auth/refresh",
    expose: true
}, async (req) => {
    try {
        // Verify refresh token from database
        const storedToken = await prisma.refreshToken.findFirst({
            where: {
                token: req.refreshToken,
                expiresAt: {
                    gt: new Date()
                }
            },
            include: {
                user: true
            }
        });

        if (!storedToken) {
            return {
                status: 'failed',
                message: 'Invalid refresh token'
            };
        }

        // Verify JWT refresh token
        try {
            jwt.verify(req.refreshToken, REFRESH_TOKEN_SECRET);
        } catch (error) {
            // Delete invalid refresh token
            await prisma.refreshToken.delete({
                where: {
                    id: storedToken.id
                }
            });
            return {
                status: 'failed',
                message: 'Invalid refresh token'
            };
        }

        // Generate new access token
        const accessToken = generateAccessToken(storedToken.user);

        return {
            status: 'success',
            accessToken
        };

    } catch (error) {
        console.error('Refresh token error:', error);
        return {
            status: 'failed',
            message: 'An error occurred while refreshing token'
        };
    }
});

// Logout endpoint
export const logout = api<RefreshRequest, { status: 'success' | 'failed', message?: string }>({
    method: "POST",
    path: "/auth/logout",
    expose: true
}, async (req) => {
    try {
        // Delete refresh token from database
        await prisma.refreshToken.deleteMany({
            where: {
                token: req.refreshToken
            }
        });

        return {
            status: 'success'
        };
    } catch (error) {
        console.error('Logout error:', error);
        return {
            status: 'failed',
            message: 'An error occurred during logout'
        };
    }
});
