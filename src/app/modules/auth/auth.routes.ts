import { Router } from "express";
import { authController } from "./auth.controller.js";
import { authGuard } from "./auth.middleware.js";
import { AuthValidation } from "./auth.validation.js";
import validateRequest from "../../middlewares/validateRequest.js";


const router = Router();

router.post("/register",
    validateRequest(AuthValidation.registerSchema),
    authController.register);

router.post(
    "/login",
    validateRequest(AuthValidation.loginSchema),
    authController.login
);


router.get("/me", authGuard, authController.getMe);
router.post("/logout", authGuard, authController.logout);


export const authRoutes = router;