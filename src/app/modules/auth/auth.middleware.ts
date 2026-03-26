import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import status from "http-status";
import AppError from "../../errorHelpers/AppError.js";

interface JwtPayload {
    id: string;
    role: string;
}

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export const authGuard = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        throw new AppError(status.UNAUTHORIZED, "You are not logged in!");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        req.user = decoded; // Attach user info to the request
        next();
    } catch (error) {
        throw new AppError(status.UNAUTHORIZED, "Invalid or expired token");
    }
};

// Middleware to restrict access to ADMIN only
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== "ADMIN") {
        throw new AppError(status.FORBIDDEN, "Access denied. Admins only.");
    }
    next();
};