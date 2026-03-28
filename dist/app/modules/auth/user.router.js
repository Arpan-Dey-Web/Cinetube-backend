import { Router } from "express";
import { userController } from "./user.controller.js";
import { checkAuth } from "../../middleware/auth.js";
const authRouter = Router();
authRouter.get("/", checkAuth(), userController.getUsers);
export default authRouter;
//# sourceMappingURL=user.router.js.map