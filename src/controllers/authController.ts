import {type Request, type Response} from "express";
import {createUser, getUserByUsername} from "../models/userModel";
import { createRefreshToken, getRefreshTokenByUserId, revokeRefreshToken } from "../models/refreshTokenModel";
import { hashPassword, verifyPassword } from "../utils/hashPassword";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../services/jwtService";
import { JWT_EXPIRATION } from "../utils/constants";


export const registerController = async (req: Request, res: Response) => {
    try {
        const { name, username, password } = req.body;
        if (!name || !username || !password) {
            return res.status(400).json({ message: 'Name, username, and password are required' });
        }
        const existingUser = await getUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const hashedPassword = await hashPassword(password);
        await createUser(name, username, hashedPassword);
        res.status(201).json({ message: 'User created successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const loginController = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        const user = await getUserByUsername(username);
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        const isPasswordValid = await verifyPassword(password, user.hashed_password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        const  accessToken = await generateAccessToken(user.id);
        const  refreshToken = await generateRefreshToken(user.id);
        const refreshTokenData = {
            user_id: user.id,
            expires_at: new Date(Date.now() + JWT_EXPIRATION.REFRESH as number), 
            created_at: new Date(),
            
        };
        await createRefreshToken(refreshTokenData);
      
        res.status(200).json({ accessToken, refreshToken }  );

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
export const refreshTokenController = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }
        let payload: {userId: number};
        try {
             payload = await verifyRefreshToken(refreshToken) as {userId: number};
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Invalid refresh token' });
        }
        const refreshTokenData = await getRefreshTokenByUserId(payload.userId);
        if (!refreshTokenData) {
            return res.status(401).json({ message: 'Refresh token not found or expired' });
        }
        const accessToken = await generateAccessToken(payload.userId);
        const newRefreshToken = await generateRefreshToken(payload.userId);
        const newRefreshTokenData = {
            user_id: payload.userId,
            expires_at: new Date(Date.now() + JWT_EXPIRATION.REFRESH as number),
            created_at: new Date(),
        };
        await createRefreshToken(newRefreshTokenData);
        await revokeRefreshToken(refreshTokenData.id);
        res.status(200).json({ accessToken, refreshToken: newRefreshToken });

        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const logoutController = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }
        let payload: {userId: number};
        try {
             payload = await verifyRefreshToken(refreshToken) as {userId: number};
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Invalid refresh token' });
        }
        const refreshTokenData = await getRefreshTokenByUserId(payload.userId);
        if (!refreshTokenData) {
            return res.status(400).json({ message: 'Invalid refresh token' });
        }
        await revokeRefreshToken(refreshTokenData.id);
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    
    }
}