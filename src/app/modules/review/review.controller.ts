import { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { ReviewService } from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.createReviewInDB({
    ...req.body,
    userId: req.user!.id,
  });

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: req.body.parentId
      ? "Comment submitted! Waiting for admin approval."
      : "Review submitted! Waiting for admin approval.",
    data: result,
  });
});

const getReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.getReviewsFromDB(req.query, req.user);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Reviews fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getFeaturedReviews = catchAsync(async (_req: Request, res: Response) => {
  const result = await ReviewService.getFeaturedReviewsFromDB();

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Featured reviews fetched successfully",
    data: result,
  });
});

const getMovieReviews = catchAsync(async (req: Request, res: Response) => {
  const { movieId } = req.params;
  const result = await ReviewService.getApprovedReviewsByMovie(
    movieId as string,
    req.user?.id,
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Reviews fetched successfully",
    data: result,
  });
});

const toggleApproval = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isApproved } = req.body;

  const result = isApproved
    ? await ReviewService.approveReviewInDB(id as string)
    : await ReviewService.unpublishReviewInDB(id as string);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: `Review ${isApproved ? "approved" : "unpublished"} successfully.`,
    data: result,
  });
});

const deleteReviewByAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await ReviewService.deleteReviewByAdminFromDB(id as string);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Review removed successfully",
    data: null,
  });
});

const toggleLike = catchAsync(async (req: Request, res: Response) => {
  const { id: reviewId } = req.params;
  const userId = req.user!.id;

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
  const userId = req.user!.id;

  const result = await ReviewService.updateMyReviewInDB(
    userId,
    reviewId as string,
    req.body,
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Review updated successfully",
    data: result,
  });
});

const deleteMyReview = catchAsync(async (req: Request, res: Response) => {
  const { id: reviewId } = req.params;
  const userId = req.user!.id;

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
  getReviews,
  getFeaturedReviews,
  getMovieReviews,
  toggleApproval,
  deleteReviewByAdmin,
  toggleLike,
  updateMyReview,
  deleteMyReview,
};
