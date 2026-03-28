import { Router } from "express";
import { userController } from "./user.controller";
import { checkAuth } from "../../middleware/auth";

const authRouter = Router();

authRouter.get("/", checkAuth(), userController.getUsers);

export default authRouter;
