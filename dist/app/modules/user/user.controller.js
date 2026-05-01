import { catchAsync } from "../../../utils/catchAsync.js";
import { sendResponse } from "../../../utils/sendResponse.js";
import { UserService } from "./user.service.js";
const getMyProfile = catchAsync(async (req, res) => {
    const result = await UserService.getMyProfileFromDB(req.user.id);
    sendResponse(res, {
        httpStatusCode: 200,
        success: true,
        message: "Profile fetched successfully",
        data: result,
    });
});
const updateMyProfile = catchAsync(async (req, res) => {
    const result = await UserService.updateMyProfileInDB(req.user.id, req.body);
    sendResponse(res, {
        httpStatusCode: 200,
        success: true,
        message: "Profile updated successfully",
        data: result,
    });
});
const getMyStats = catchAsync(async (req, res) => {
    const result = await UserService.getUserStatsFromDB(req.user.id);
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
//# sourceMappingURL=user.controller.js.map