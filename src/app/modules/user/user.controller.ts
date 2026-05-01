import { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { UserService } from "./user.service";

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getMyProfileFromDB(req.user!.id);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Profile fetched successfully",
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.updateMyProfileInDB(req.user!.id, req.body);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});

const getMyStats = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getUserStatsFromDB(req.user!.id);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "User stats fetched successfully",
    data: result,
  });
});

export const UserController = {
  getMyProfile,
  updateMyProfile,
  getMyStats,
};
