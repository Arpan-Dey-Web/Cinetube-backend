import { Router } from "express";
import { auth } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { WatchlistController } from "./watchlist.controller";
import { WatchlistValidation } from "./watchlist.validation";

const watchlistRouter = Router();

// Get the logged-in user's list
watchlistRouter.get(
  "/",
  auth("USER", "ADMIN"),
  WatchlistController.getMyWatchlist
);

// Toggle a movie (Add/Remove)
watchlistRouter.post(
  "/toggle",
  auth("USER", "ADMIN"),
  validateRequest(WatchlistValidation.addToWatchlistSchema),
  WatchlistController.toggleWatchlist
);

export default watchlistRouter;