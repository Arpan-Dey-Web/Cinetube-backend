import { toNodeHandler } from "better-auth/node";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import qs from "qs";
import { auth } from "./lib/auth.js";
import { handleStripeWebhook } from "./app/modules/payment/payment.webhook.js";
import movieRouter from "./app/modules/movie/movie.route.js";
import reviewRouter from "./app/modules/review/review.route.js";
import paymentRouter from "./app/modules/payment/payment.route.js";
import watchlistRouter from "./app/modules/watchlist/watchlist.route.js";
import purchaseRouter from "./app/modules/purchase/purchase.route.js";
import adminRouter from "./app/modules/admin/admin.routes.js";
import { rootRoute } from "./app/modules/root.route.js";
const app = express();
app.set("query parser", (str) => qs.parse(str));
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
}));
// ========================== SPECIAL STRIPE WEBHOOK ==========================
app.post("/api/payment/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);
// ========================== REGULAR MIDDLEWARES ==========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// ========================== CONNECT ROUTES ==========================
// Better auth handler
app.all("/api/auth/*splat", toNodeHandler(auth));
// Movie Routes
app.use("/api/movie", movieRouter);
// Review Routes
app.use("/api/review", reviewRouter);
// Payment Routes
app.use("/api/payment", paymentRouter);
// Watchlist Routes
app.use("/api/watchlist", watchlistRouter);
// Purchase Routes
app.use("/api/purchase", purchaseRouter);
// Special Admin Routes
app.use("/api/admin", adminRouter);
// Root route
app.get("/", rootRoute);
export default app;
//# sourceMappingURL=app.js.map