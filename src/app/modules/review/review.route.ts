import { Router } from "express";
import { ReviewController } from "./review.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../enums/enum";
import { validateRequest } from "../../middleware/validateRequest";
import { ReviewValidation } from "./review.validation";

const reviewRouter = Router();

reviewRouter.post(
  "/",
  auth(Role.User),
  validateRequest(ReviewValidation.createReviewSchema),
  ReviewController.createReview,
);

reviewRouter.get("/:movieId", ReviewController.getMovieReviews);

reviewRouter.patch(
  "/approve/:id",
  auth(Role.Admin),
  validateRequest(ReviewValidation.updateReviewSchema),
  ReviewController.approveReview,
);

export default reviewRouter;
