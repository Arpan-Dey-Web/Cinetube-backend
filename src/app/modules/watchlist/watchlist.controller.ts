import { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { WatchlistService } from "./watchlist.service";

const toggleWatchlist = catchAsync(async (req: Request, res: Response) => {
  const { movieId } = req.body;
  const userId = req.user!.id;

  const result = await WatchlistService.toggleWatchlistInDB(userId, movieId);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: result.added
      ? "Movie added to watchlist successfully"
      : "Movie removed from watchlist successfully",
    data: result,
  });
});

const getMyWatchlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await WatchlistService.getUserWatchlistFromDB(userId);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Watchlist fetched successfully",
    data: result,
  });
});

export const WatchlistController = {
  toggleWatchlist,
  getMyWatchlist,
};
