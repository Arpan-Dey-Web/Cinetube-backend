import { prisma } from "../../../lib/prisma";

export const updateMovieRating = async (movieId: string) => {
  // 1. Use Prisma Aggregate to get the average directly from DB
  const aggregation = await prisma.review.aggregate({
    where: {
      movieId: movieId,
      isApproved: true, // Only count verified reviews
    },
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    }
  });

  const averageRating = aggregation._avg.rating || 0;
  
  // 2. Round to 1 decimal place (e.g., 8.356 -> 8.4)
  const roundedRating = Math.round(averageRating * 10) / 10;

  // 3. Sync the new average back to the Movie model
  await prisma.movie.update({
    where: { id: movieId },
    data: { 
      rating: roundedRating,
      // You can also track review count if you added that field to Movie
    },
  });

  return roundedRating;
};