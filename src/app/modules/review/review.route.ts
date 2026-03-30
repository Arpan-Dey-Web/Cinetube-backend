import { Router } from "express";
import { ReviewController } from "./review.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../enums/enum";
import { validateRequest } from "../../middleware/validateRequest";
import { ReviewValidation } from "./review.validation";

const reviewRouter = Router();

// 1. Public: Get reviews for a movie
reviewRouter.get("/:movieId", ReviewController.getMovieReviews);

// 2. User: Create a new review
reviewRouter.post(
  "/",
  auth(Role.User),
  validateRequest(ReviewValidation.createReviewSchema),
  ReviewController.createReview,
);


reviewRouter.patch(
  "/my-review/:id",
  auth(Role.User),
  validateRequest(ReviewValidation.updateReviewSchema),
  ReviewController.updateMyReview
);

// 4. User: Delete own review
reviewRouter.delete(
  "/my-review/:id",
  auth(Role.User),
  ReviewController.deleteMyReview
);

// 5. User: Toggle Like/Unlike on a review
reviewRouter.post(
  "/like/:id",
  auth(Role.User),
  ReviewController.toggleLike
);

// 6. Admin: Moderate/Approve/Unpublish
reviewRouter.patch(
  "/moderate/:id",
  auth(Role.Admin),
  ReviewController.toggleApproval
);

export default reviewRouter;