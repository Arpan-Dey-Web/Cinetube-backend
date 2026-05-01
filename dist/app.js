import { toNodeHandler } from "better-auth/node";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import qs from "qs";
import globalErrorHandler from "./app/middleware/globalErrorHandler.js";
import adminRouter from "./app/modules/admin/admin.routes.js";
import movieRouter from "./app/modules/movie/movie.route.js";
import paymentRouter from "./app/modules/payment/payment.route.js";
import { handleStripeWebhook } from "./app/modules/payment/payment.webhook.js";
import purchaseRouter from "./app/modules/purchase/purchase.route.js";
import reviewRouter from "./app/modules/review/review.route.js";
import { rootRoute } from "./app/modules/root.route.js";
import userRouter from "./app/modules/user/user.route.js";
import watchlistRouter from "./app/modules/watchlist/watchlist.route.js";
import { auth } from "./lib/auth.js";
const app = express();
app.set("query parser", (str) => qs.parse(str));
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
}));
app.post("/api/payment/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);
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
//# sourceMappingURL=app.js.map