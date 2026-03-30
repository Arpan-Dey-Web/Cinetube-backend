import { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { WatchlistService } from "./watchlist.service";

const toggleWatchlist = catchAsync(async (req: Request, res: Response) => {
  const { movieId } = req.body;
  const userId = req.user.id; // Populated by auth middleware

  const result = await WatchlistService.toggleWatchlistInDB(userId, movieId);

  // If the service returns a deleted record, it was removed. If created, it was added.
  const isAdded = !!(result as any).id && !(req as any).isDeleted; 

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Watchlist updated successfully",
    data: result,
  });
});

const getMyWatchlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
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