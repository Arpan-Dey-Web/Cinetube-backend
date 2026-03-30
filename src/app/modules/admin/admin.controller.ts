
import { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { AdminService } from "./admin.service";

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAdminStats();

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Admin dashboard stats fetched successfully",
    data: result,
  });
});

export const AdminController = {
  getDashboardStats,
};