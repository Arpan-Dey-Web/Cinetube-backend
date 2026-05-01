import { Router } from "express";
import { Role } from "../../../enums/enum";
import { auth, optionalAuth } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { ReviewController } from "./review.controller";
import { ReviewValidation } from "./review.validation";

const reviewRouter = Router();

reviewRouter.get("/featured", ReviewController.getFeaturedReviews);

reviewRouter.get(
  "/",
  optionalAuth(),
  validateRequest(ReviewValidation.getReviewsQuerySchema),
  ReviewController.getReviews,
);

reviewRouter.post(
  "/",
  auth(Role.User, Role.Admin),
  validateRequest(ReviewValidation.createReviewSchema),
  ReviewController.createReview,
);

reviewRouter.patch(
  "/my-review/:id",
  auth(Role.User, Role.Admin),
  validateRequest(ReviewValidation.updateReviewSchema),
  ReviewController.updateMyReview,
);

reviewRouter.delete(
  "/my-review/:id",
  auth(Role.User, Role.Admin),
  ReviewController.deleteMyReview,
);

reviewRouter.post(
  "/like/:id",
  auth(Role.User, Role.Admin),
  ReviewController.toggleLike,
);

reviewRouter.patch(
  "/moderate/:id",
  auth(Role.Admin),
  validateRequest(ReviewValidation.moderateReviewSchema),
  ReviewController.toggleApproval,
);

reviewRouter.delete(
  "/moderate/:id",
  auth(Role.Admin),
  ReviewController.deleteReviewByAdmin,
);

reviewRouter.get("/:movieId", optionalAuth(), ReviewController.getMovieReviews);

export default reviewRouter;
