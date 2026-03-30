import { Review } from "../../../generated/client";
import { prisma } from "../../../lib/prisma";
import { updateMovieRating } from "./review.utilis";

const createReviewInDB = async (reviewData: Partial<Review>) => {
  const { userId, movieId, rating, comment, isSpoiler } = reviewData;

  // 1. Explicit Check for TypeScript & Safety
  if (!userId || !movieId) {
    throw new Error("User ID and Movie ID are required to submit a review.");
  }

  // 2. Logic Check: Prevent duplicate reviews
  const existingReview = await prisma.review.findFirst({
    where: {
      userId, 
      movieId,
    },
  });

  if (existingReview) {
    throw new Error("You have already submitted a review for this movie.");
  }

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
      user: { select: { name: true, image: true } },
    },
  });
};

const getApprovedReviewsByMovie = async (movieId: string) => {
  return await prisma.review.findMany({
    where: {
      movieId,
      isApproved: true,
    },
    include: {
      user: { select: { name: true, image: true } },
      _count: {
        select: { reviewLikes: true } // This returns a "reviewLikes" count field
      }
    },
    orderBy: { createdAt: "desc" },
  });
};

const approveReviewInDB = async (reviewId: string) => {
  // 1. Update the review status
  const updatedReview = await prisma.review.update({
    where: { id: reviewId },
    data: { isApproved: true },
  });

  // 2. Trigger the recalculation for the specific movie
  await updateMovieRating(updatedReview.movieId);

  return updatedReview;
};


const unpublishReviewInDB = async (reviewId: string) => {
  const result = await prisma.review.update({
    where: { id: reviewId },
    data: { isApproved: false },
  });

  // Recalculate again (so the rating drops if a high review is removed)
  await updateMovieRating(result.movieId);

  return result;
};


const toggleReviewLike = async (userId: string, reviewId: string) => {
  // 1. Check if the like already exists
  const existingLike = await prisma.reviewLike.findUnique({
    where: {
      userId_reviewId: { userId, reviewId },
    },
  });

  if (existingLike) {
    // 2. Unlike: Remove the record
    await prisma.reviewLike.delete({
      where: {
        userId_reviewId: { userId, reviewId },
      },
    });
    return { liked: false };
  } else {
    // 3. Like: Create the record
    await prisma.reviewLike.create({
      data: { userId, reviewId },
    });
    return { liked: true };
  }
};


const updateMyReviewInDB = async (userId: string, reviewId: string, payload: Partial<Review>) => {
  const isExist = await prisma.review.findUnique({ where: { id: reviewId } });

  if (!isExist) throw new Error("Review not found");
  if (isExist.userId !== userId) throw new Error("You can only edit your own reviews");
  
  // CRITICAL REQUIREMENT CHECK
  if (isExist.isApproved) {
    throw new Error("Cannot edit a review once it has been approved by an admin.");
  }

  return await prisma.review.update({
    where: { id: reviewId },
    data: payload
  });
};

const deleteMyReviewFromDB = async (userId: string, reviewId: string) => {
  const isExist = await prisma.review.findUnique({ where: { id: reviewId } });

  if (!isExist) throw new Error("Review not found");
  if (isExist.userId !== userId) throw new Error("You can only delete your own reviews");

  // If deleting an approved review, we must update the movie rating
  const result = await prisma.review.delete({ where: { id: reviewId } });
  
  if (isExist.isApproved) {
    await updateMovieRating(isExist.movieId);
  }

  return result;
};

export const ReviewService = {
  createReviewInDB,
  getApprovedReviewsByMovie,
  approveReviewInDB,
  unpublishReviewInDB,
  toggleReviewLike,
  updateMyReviewInDB,
  deleteMyReviewFromDB
};
