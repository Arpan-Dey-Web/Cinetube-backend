import { Request, Response } from "express";


export const GlobalErrorHandler = ((err: any, req: Request, res: Response, next: any) => {
    const statusCode = err.statuscode || 500;
    const message = err.message || "Something went wrong";

    console.log(err)
    
    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
});