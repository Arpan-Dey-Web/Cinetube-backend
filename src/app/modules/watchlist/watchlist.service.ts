import { prisma } from "../../../lib/prisma";

const toggleWatchlistInDB = async (userId: string, movieId: string) => {
  // Check if it already exists
  const isExist = await prisma.watchlist.findUnique({
    where: {
      userId_movieId: { userId, movieId },
    },
  });

  if (isExist) {
    // If it exists, remove it (Toggle off)
    return await prisma.watchlist.delete({
      where: {
        userId_movieId: { userId, movieId },
      },
    });
  }

  // If it doesn't exist, add it (Toggle on)
  return await prisma.watchlist.create({
    data: { userId, movieId },
  });
};

const getUserWatchlistFromDB = async (userId: string) => {
  return await prisma.watchlist.findMany({
    where: { userId },
    include: {
      movie: true, // Bring the movie details along
    },
  });
};

export const WatchlistService = {
  toggleWatchlistInDB,
  getUserWatchlistFromDB,
};