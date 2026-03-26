import express, { Application, Request, Response } from "express";

import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import { authRoutes } from "./app/modules/auth/auth.routes.js";
import { GlobalErrorHandler } from "./app/errorHelpers/GlobalErrorHandler.js";
import { movieRoutes } from "./app/modules/movie/movie.routes.js";


const app: Application = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization",],
}))



app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);


// Root route 
app.get('/', async (req: Request, res: Response) => {
    res.status(201).json({
        success: true,
        message: 'CineTube API is working',
    })
});



app.use(GlobalErrorHandler)

export default app;