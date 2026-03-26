import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma.js";
import AppError from "../../errorHelpers/AppError.js";
import status from "http-status";


const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, name, phone, address, profilePicture } = req.body;
        console.log(email)
        const normalizedEmail = email.toLowerCase();
        console.log(normalizedEmail)
        const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        console.log(existingUser)
        
        if (existingUser) {
            throw new AppError(status.BAD_REQUEST, "User already exists, Please try to login");
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                email: normalizedEmail,
                password: hashedPassword,
                name,
                phone,
                address,
                profilePicture
            },
        });

        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: userWithoutPassword
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email.toLowerCase();

        const user = await prisma.user.findUnique({
            where: { email: normalizedEmail }
        });

        if (!user) {
            throw new AppError(status.NOT_FOUND, "User does not exist");
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            throw new AppError(status.UNAUTHORIZED, "Invalid password credentials");
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(status.OK).json({
            success: true,
            message: "User logged in successfully",
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        console.log("--- DEBUG ERROR ---");
        next(error);
    }
};

const getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                profilePicture: true,
                phone: true,
                address: true,
            }
        });

        if (!user) {
            throw new AppError(status.NOT_FOUND, "User not found");
        }

        res.status(status.OK).json({
            success: true,
            message: "User profile retrieved successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

const logout = (req: Request, res: Response) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
    });
    res.status(status.OK).json({
        success: true,
        message: "Logged out successfully. See you soon!",
    });
};

export const authController = {
    register,
    login,
    getMe,
    logout,
}