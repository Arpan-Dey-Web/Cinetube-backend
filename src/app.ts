import { toNodeHandler } from "better-auth/node";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import qs from "qs";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import adminRouter from "./app/modules/admin/admin.routes";
import movieRouter from "./app/modules/movie/movie.route";
import paymentRouter from "./app/modules/payment/payment.route";
import { handleStripeWebhook } from "./app/modules/payment/payment.webhook";
import purchaseRouter from "./app/modules/purchase/purchase.route";
import reviewRouter from "./app/modules/review/review.route";
import { rootRoute } from "./app/modules/root.route";
import userRouter from "./app/modules/user/user.route";
import watchlistRouter from "./app/modules/watchlist/watchlist.route";
import { auth } from "./lib/auth";

const app: Application = express();

app.set("query parser", (str: string) => qs.parse(str));

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  }),
);

app.post(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook,
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/movie", movieRouter);
app.use("/api/review", reviewRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/watchlist", watchlistRouter);
app.use("/api/purchase", purchaseRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);

app.get("/", rootRoute);

app.use(globalErrorHandler);

export default app;
