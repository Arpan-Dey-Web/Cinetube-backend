import dotenv from "dotenv";
import AppError from "../app/errorHelpers/AppError.js";

dotenv.config()

interface EnvConfig {
    NODEENV: string;
    PORT: string;
    DATABASEURL: string;
    JWT_SECRET: string;
}


const loadEnvVariables = (): EnvConfig => {
    const requiredEnvVariables = [
        "NODE_ENV",
        "PORT",
        "DATABASE_URL",
        "JWT_SECRET"
    ];


    requiredEnvVariables.forEach((variable) => {
        if (!process.env[variable]) {
            throw new AppError(500, `Environment variable ${variable} is required but is not set. in .env file`);
        }
    });

    return {
        NODEENV: process.env.NODE_ENV as string,
        PORT: process.env.PORT as string,
        DATABASEURL: process.env.DATABASE_URL as string,
        JWT_SECRET: process.env.JWT_SECRET as string

    }


}

export const envVars = loadEnvVariables();
