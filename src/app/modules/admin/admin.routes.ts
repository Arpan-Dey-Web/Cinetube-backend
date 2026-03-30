import { Router } from "express";
import { auth } from "../../middleware/auth";
import { AdminController } from "./admin.controller";
import { Role } from "../../../enums/enum";

const adminRouter = Router();

// Only Admins can see the dashboard stats
adminRouter.get(
  "/dashboard-stats",
  auth(Role.Admin), 
  AdminController.getDashboardStats
);

export default adminRouter;