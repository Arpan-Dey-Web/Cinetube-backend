import { Request, Response } from "express";
import { ReviewService } from "./review.service";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";

const createReview = catchAsync(async (req: Request, res: Response) => {
  // In a real app, userId would come from req.user (Auth Middleware)
  const result = await ReviewService.createReviewInDB(req.body);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Review submitted! Waiting for admin approval.",
    data: result,
  });
});

const getMovieReviews = catchAsync(async (req: Request, res: Response) => {
  const { movieId } = req.params;
  const result = await ReviewService.getApprovedReviewsByMovie(movieId as string) ;

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Reviews fetched successfully",
    data: result,
  });
});

const approveReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ReviewService.approveReviewInDB(id as string);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Review approved and movie rating updated",
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getMovieReviews,
  approveReview
};