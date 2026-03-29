import { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { PurchaseService } from "./purchase.service";

const getMyPurchases = catchAsync(async (req: Request, res: Response) => {
  // Get the ID from the IRequestUser attached by auth middleware
  const userId = req.user.id;

  const result = await PurchaseService.getMyPurchasesFromDB(userId);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Purchase history fetched successfully",
    data: result,
  });
});

// 2. New: Create a Manual Purchase (If not using Stripe Webhooks only)
const createPurchase = catchAsync(async (req: Request, res: Response) => {
    const { movieId, amount, transactionId } = req.body;
    const userId = req.user.id;
  
    const result = await PurchaseService.createPurchaseInDB(
      userId,
      movieId,
      amount,
      transactionId
    );
  
    sendResponse(res, {
      httpStatusCode: 201,
      success: true,
      message: "Purchase completed successfully",
      data: result,
    });
  });
  
  // 3. New: Verify if user can watch a movie
  const verifyAccess = catchAsync(async (req: Request, res: Response) => {
    const { movieId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
  
    const hasAccess = await PurchaseService.checkMovieAccess(
        userId,
        userRole, 
        movieId as string);
  
    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: hasAccess ? "Access granted" : "Access denied",
      data: { hasAccess },
    });
  });




export const PurchaseController = {
  getMyPurchases,
  createPurchase,
  verifyAccess,
};