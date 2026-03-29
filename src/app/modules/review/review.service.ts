import { Review } from "../../../generated/client";
import { prisma } from "../../../lib/prisma";

const createReviewInDB = async (reviewData: Partial<Review>) => {
  const { userId, movieId, rating, comment, isSpoiler } = reviewData;

  return await prisma.review.create({
    data: {
      userId: userId!,
      movieId: movieId!,
      rating: Number(rating),
      comment: comment!,
      isSpoiler: isSpoiler || false,
      isApproved: false, // Requirement: Admin must approve first
    },
    include: {
      user: { select: { name: true, image: true } }
    }
  });
};

const getApprovedReviewsByMovie = async (movieId: string) => {
  return await prisma.review.findMany({
    where: {
      movieId,
      isApproved: true, // Only show what's moderated
    },
    include: {
      user: { select: { name: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

const approveReviewInDB = async (reviewId: string) => {
  const result = await prisma.$transaction(async (tx) => {
    // 1. Approve the review
    const updatedReview = await tx.review.update({
      where: { id: reviewId },
      data: { isApproved: true },
    });

    // 2. Recalculate Movie Average Rating (Editorial Requirement)
    const stats = await tx.review.aggregate({
      where: { movieId: updatedReview.movieId, isApproved: true },
      _avg: { rating: true },
      _count: { id: true }
    });

    await tx.movie.update({
      where: { id: updatedReview.movieId },
      data: {
        rating: stats._avg.rating || 0,
      },
    });

    return updatedReview;
  });

  return result;
};

export const ReviewService = {
  createReviewInDB,
  getApprovedReviewsByMovie,
  approveReviewInDB
};