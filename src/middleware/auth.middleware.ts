import {type Request, type Response, type NextFunction} from 'express';
import { verifyAccessToken } from '../services/jwtService';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({message: 'Authorization header missing'});
    }

    const parameters  = authHeader.split(' ');
    if (parameters.length !== 2 || parameters[0] !== 'Bearer') {
        return res.status(401).json({message: 'Invalid authorization header format'});
    }

    const token = parameters[1];
    try {
        const payload = await verifyAccessToken(token!);
        req.user = { userId: payload.userId as number };
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({message: 'Invalid token'});
    }
   
};