import { toNodeHandler } from "better-auth/node";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import path from "path";
import qs from "qs";
import { auth } from "./lib/auth.js";
import movieRouter from "./app/modules/movie/movie.route.js";
const app = express();
app.set("query parser", (str) => qs.parse(str));
app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), `src/app/templates`));
// app.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   PaymentController.handleStripeWebhookEvent,
// );
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
}));
// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));
// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// ========================== Connect Routes ==========================
// Bettr auth hander
app.all('/api/auth/*splat', toNodeHandler(auth));
// Movie Routes
app.use("/api/movie", movieRouter);
// Basic route
app.get("/", async (req, res) => {
    res.status(201).json({
        success: true,
        message: "API is working",
    });
});
// ======================== Global Error Handler / Not Found Handler / Other Middleware ========================
// app.use(globalErrorHandler);
// app.use(notFound);
export default app;
//# sourceMappingURL=app.js.map