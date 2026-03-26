import { z } from "zod";

const registerSchema = z.object({
    body: z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        password: z
            .string()
            .min(6, "Password must be at least 6 characters")
            .regex(/[0-9]/, "Password must contain at least one number"),
        role: z.enum(["USER", "ADMIN"]).default("USER"),
        phone: z.string().optional(),
        address: z.string().optional(),
        profilePicture: z.string().optional(),
    }),
});

const loginSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(1, "Password is required"),
    }),
});

export const AuthValidation = {
    registerSchema,
    loginSchema,
};