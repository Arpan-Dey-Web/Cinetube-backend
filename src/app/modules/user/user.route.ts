import { Router } from "express";
import { auth } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";

const userRouter = Router();

userRouter.get("/profile", auth("USER", "ADMIN"), UserController.getMyProfile);

userRouter.patch(
  "/profile",
  auth("USER", "ADMIN"),
  validateRequest(UserValidation.updateProfileSchema),
  UserController.updateMyProfile,
);

userRouter.get("/stats", auth("USER", "ADMIN"), UserController.getMyStats);

export default userRouter;
