import { Request, Response } from "express";
import { ReviewService } from "./review.service";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";

const createReview = catchAsync(async (req: Request, res: Response) => {
  // Ensure the userId comes from the AUTH middleware, not the request body
  const result = await ReviewService.createReviewInDB({
    ...req.body,
    userId: req.user.id // This comes from your auth middleware
  });

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


const toggleApproval = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isApproved } = req.body; // Expecting boolean

  let result;
  if (isApproved) {
    result = await ReviewService.approveReviewInDB(id as string);
  } else {
    result = await ReviewService.unpublishReviewInDB(id as string);
  }

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: `Review ${isApproved ? 'approved' : 'unpublished'} and rating updated.`,
    data: result,
  });
});

const toggleLike = catchAsync(async (req: Request, res: Response) => {
  const { id: reviewId } = req.params;
  const userId = req.user.id;

  const result = await ReviewService.toggleReviewLike(userId, reviewId as string);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: result.liked ? "Review liked" : "Like removed",
    data: result,
  });
});

const updateMyReview = catchAsync(async (req: Request, res: Response) => {
  const { id: reviewId } = req.params;
  const userId = req.user.id;

  const result = await ReviewService.updateMyReviewInDB(userId, reviewId as string, req.body);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Review updated successfully",
    data: result,
  });
});

const deleteMyReview = catchAsync(async (req: Request, res: Response) => {
  const { id: reviewId } = req.params;
  const userId = req.user.id;

  await ReviewService.deleteMyReviewFromDB(userId, reviewId as string);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Review deleted successfully",
    data: null,
  });
});


export const ReviewController = {
  createReview,
  getMovieReviews,
  approveReview,
  toggleApproval,
  toggleLike,
  updateMyReview,
  deleteMyReview,
};