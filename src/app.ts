import { toNodeHandler } from "better-auth/node";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import path from "path";
import qs from "qs";
import { auth } from "./lib/auth";
import movieRouter from "./app/modules/movie/movie.route";
import reviewRouter from "./app/modules/review/review.route";
import paymentRouter from "./app/modules/payment/payment.route"; // New
import { handleStripeWebhook } from "./app/modules/payment/payment.webhook"; // New

const app: Application = express();

app.set("query parser", (str: string) => qs.parse(str));
app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), `src/app/templates`));

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  }),
);

// ========================== SPECIAL STRIPE WEBHOOK ==========================
app.post(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

// ========================== REGULAR MIDDLEWARES ==========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========================== CONNECT ROUTES ==========================

// Better auth handler
app.all('/api/auth/*splat', toNodeHandler(auth));

// Movie Routes
app.use("/api/movie", movieRouter);

// Review Routes
app.use("/api/review", reviewRouter);

// Payment Routes
app.use("/api/payment", paymentRouter);

// Basic route
app.get("/", async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Movie Server Is Running",
  });
});

export default app;