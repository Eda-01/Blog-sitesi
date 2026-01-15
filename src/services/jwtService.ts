import { SignJWT, jwtVerify } from "jose";
import { JWT_EXPIRATION } from "../utils/constants";

const generateAccessSecret = async () => {
    return new TextEncoder().encode(process.env.JWT_ACCESS_SECRET_KEY);
};

const generateRefreshSecret = async () => {
    return new TextEncoder().encode(process.env.JWT_REFRESH_SECRET_KEY);
};

export const verifyAccessToken = async (token: string) => {
    const secret = await generateAccessSecret();
    const { payload } = await jwtVerify(token, secret);
    return payload;
};

export const verifyRefreshToken = async (token: string) => {
    const secret = await generateRefreshSecret();
    const { payload } = await jwtVerify(token, secret);
    return payload;
};

export const generateAccessToken = async (userId: number) => {
    const secret = await generateAccessSecret();
    

    const expirationTime = `${(JWT_EXPIRATION.ACCESS as number) / 1000}s`;

    const token = await new SignJWT({ userId })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt() 
        .setExpirationTime(expirationTime) 
        .sign(secret);
    return token;
};

export const generateRefreshToken = async (userId: number) => {
    const secret = await generateRefreshSecret();
    
    const expirationTime = `${(JWT_EXPIRATION.REFRESH as number) / 1000}s`;

    const token = await new SignJWT({ userId })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(expirationTime)
        .sign(secret);
    return token;
};