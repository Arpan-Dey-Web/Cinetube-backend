import { z } from "zod";

const addToWatchlistSchema = z.object({
  body: z.object({
    movieId: z.string({ message: "Movie ID is required" }),
  }),
});

export const WatchlistValidation = {
  addToWatchlistSchema,
};