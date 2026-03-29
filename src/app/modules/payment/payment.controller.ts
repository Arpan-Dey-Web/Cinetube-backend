import { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { PaymentService } from "./payment.service";

const createPaymentIntent = catchAsync(async (req: Request, res: Response) => {
  const { movieId } = req.body;
  const userId = req.user.id;
  const userStatus = req.user.contentStatus;

  if (userStatus === "PREMIUM") {
    return sendResponse(res, {
      httpStatusCode: 400,
      success: false,
      message: "You already have Premium access to all content!",
    });
  }

  // 2. Call the service to create the Stripe Intent
  const result = await PaymentService.createPaymentIntentInDB(userId, movieId);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Payment intent created successfully",
    data: result,
  });
});

export const PaymentController = {
  createPaymentIntent,
};