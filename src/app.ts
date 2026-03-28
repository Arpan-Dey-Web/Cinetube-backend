import { toNodeHandler } from "better-auth/node";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import path from "path";
import qs from "qs";
import { auth } from "./lib/auth";
import authRouter from "./app/modules/auth/user.router";

const app: Application = express();
app.set("query parser", (str: string) => qs.parse(str));

app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), `src/app/templates`));

// app.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   PaymentController.handleStripeWebhookEvent,
// );

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    // methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    // allowedHeaders: [["Content-Type", "Authorization", "Cookie"],
  }),
);

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// ========================== Connect Routes ==========================


// Bettr auth hander
app.all('/api/auth/*splat', toNodeHandler(auth));

// app.use("/api/auth", authRouter);

// Basic route
app.get("/", async (req: Request, res: Response) => {
  res.status(201).json({
    success: true,
    message: "API is working",
  });
});

// ======================== Global Error Handler / Not Found Handler / Other Middleware ========================
// app.use(globalErrorHandler);
// app.use(notFound);

export default app;

// dont use corn, multer, socket.io etc (scheduler, file uploader, socket)
