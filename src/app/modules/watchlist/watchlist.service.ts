import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../../lib/prisma";

type ToggleWatchlistResult = {
  added: boolean;
  watchlist: {
    id: string;
    userId: string;
    movieId: string;
    createdAt: Date;
    updatedAt: Date;
  };
};

const toggleWatchlistInDB = async (
  userId: string,
  movieId: string,
): Promise<ToggleWatchlistResult> => {
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
    select: { id: true },
  });

  if (!movie) {
    throw new AppError(404, "Movie not found.");
  }

  const existingEntry = await prisma.watchlist.findUnique({
    where: {
      userId_movieId: { userId, movieId },
    },
  });

  if (existingEntry) {
    const deletedEntry = await prisma.watchlist.delete({
      where: {
        userId_movieId: { userId, movieId },
      },
    });

    return {
      added: false,
      watchlist: deletedEntry,
    };
  }

  const createdEntry = await prisma.watchlist.create({
    data: { userId, movieId },
  });

  return {
    added: true,
    watchlist: createdEntry,
  };
};

const getUserWatchlistFromDB = async (userId: string) => {
  return prisma.watchlist.findMany({
    where: { userId },
    include: {
      movie: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const WatchlistService = {
  toggleWatchlistInDB,
  getUserWatchlistFromDB,
};
