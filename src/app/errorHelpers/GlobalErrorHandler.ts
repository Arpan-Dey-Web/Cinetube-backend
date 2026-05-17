import { NextFunction, Request, Response } from "express";

type ErrorLike = {
    statuscode?: number;
    message?: string;
    stack?: string;
};

export const GlobalErrorHandler = ((err: ErrorLike, _req: Request, res: Response, _next: NextFunction) => {
    const statusCode = err.statuscode || 500;
    const message = err.message || "Something went wrong";

    console.log(err);
    
    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
});
