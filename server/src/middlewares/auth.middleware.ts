import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import User from "../models/user.model.js";

declare global {
    namespace Express {
        interface Request {
            user?: any; // Define user property
        }
    }
}

const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!accessToken) {
            return res.status(401).json({ statusCode : 401, message: 'No token provided' });
        }

        const getJWTUnsigned = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string);

        const user = await User.findById((getJWTUnsigned as any)?._id)

        if(!user){
            res.status(401).send('Invalid Access Token');
        }

        req.user = user;
        next();
    } catch (error) {
        console.log('Error from auth middleware', error);
        res.status(401).json({statusCode: 401, message : error || "Invalid Access Token." })
    }

}

export default verifyJWT;
