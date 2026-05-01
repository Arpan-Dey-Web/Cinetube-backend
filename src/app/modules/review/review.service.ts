import { Prisma, Review } from "../../../generated/client";
import { prisma } from "../../../lib/prisma";
import { IRequestUser } from "../../../types/types";
import { updateMovieRating } from "./review.utilis";

type ReviewPayload = Partial<Review> & {
  userId: string;
  movieId: string;
  tags?: string[];
};

const baseReviewInclude = (currentUserId?: string) =>
  ({
    user: {
      select: {
        id: true,
        name: true,
        image: true,
        role: true,
      },
    },
    _count: {
      select: {
        reviewLikes: true,
        children: true,
      },
    },
    reviewLikes: currentUserId
      ? {
          where: {
            userId: currentUserId,
          },
          select: {
            id: true,
          },
        }
      : false,
  }) satisfies Prisma.ReviewInclude;

const reviewTreeInclude = (currentUserId?: string) =>
  ({
    ...baseReviewInclude(currentUserId),
    children: {
      where: {
        isApproved: true,
      },
      include: baseReviewInclude(currentUserId),
      orderBy: {
        createdAt: "asc",
      },
    },
  }) satisfies Prisma.ReviewInclude;

const deleteReviewTree = async (
  tx: Prisma.TransactionClient,
  reviewId: string,
) => {
  await tx.review.deleteMany({
    where: {
      OR: [{ id: reviewId }, { parentId: reviewId }],
    },
  });
};

const syncReviewLikeCount = async (
  tx: Prisma.TransactionClient,
  reviewId: string,
) => {
  const likeCount = await tx.reviewLike.count({
    where: { reviewId },
  });

  await tx.review.update({
    where: { id: reviewId },
    data: { likes: likeCount },
  });

  return likeCount;
};

const createReviewInDB = async (reviewData: ReviewPayload) => {
  const { userId, movieId, rating, comment, isSpoiler, parentId, tags = [] } =
    reviewData;

  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
    select: { id: true },
  });

  if (!movie) {
    throw new Error("Movie not found.");
  }

  if (parentId) {
    const parentReview = await prisma.review.findUnique({
      where: { id: parentId },
      select: { id: true, movieId: true },
    });

    if (!parentReview) {
      throw new Error("Parent review not found.");
    }

    if (parentReview.movieId !== movieId) {
      throw new Error("Reply must belong to the same movie.");
    }
  }

  return prisma.review.create({
    data: {
      userId,
      movieId,
      rating: parentId ? 0 : Number(rating),
      comment: comment!,
      tags,
      isSpoiler: isSpoiler || false,
      isApproved: true,
      parentId: parentId || null,
    },
    include: baseReviewInclude(userId),
  });
};

const getApprovedReviewsByMovie = async (
  movieId: string,
  currentUserId?: string,
) => {
  return prisma.review.findMany({
    where: {
      movieId,
      isApproved: true,
      parentId: null,
    },
    include: reviewTreeInclude(currentUserId),
    orderBy: { createdAt: "desc" },
  });
};

const getReviewsFromDB = async (
  query: Record<string, unknown>,
  currentUser?: IRequestUser,
) => {
  const status = query.status ? String(query.status) : undefined;
  const page = query.page ? Number(query.page) : 1;
  const limit = query.limit ? Number(query.limit) : 10;
  const skip = (page - 1) * limit;

  const where: Prisma.ReviewWhereInput = {
    parentId: null,
  };

  if (query.movieId) {
    where.movieId = String(query.movieId);
  }

  if (query.userId === "me") {
    if (!currentUser) {
      throw new Error("Please log in to see your reviews.");
    }

    where.userId = currentUser.id;
  }

  if (status === "PENDING") {
    if (currentUser?.role === "ADMIN") {
      where.isApproved = false;
    } else if (where.userId) {
      where.isApproved = false;
    } else {
      where.isApproved = true;
    }
  } else if (status === "APPROVED") {
    where.isApproved = true;
  } else if (status !== "ALL") {
    if (!(currentUser?.role === "ADMIN" && where.userId) && !where.userId) {
      where.isApproved = true;
    }
  }

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      skip,
      take: limit,
      include: {
        ...reviewTreeInclude(currentUser?.id),
        movie: {
          select: {
            id: true,
            title: true,
            posterUrl: true,
            year: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.review.count({ where }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: reviews,
  };
};

const getFeaturedReviewsFromDB = async (limit = 6) => {
  return prisma.review.findMany({
    where: {
      isApproved: true,
      parentId: null,
    },
    take: limit,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          role: true,
        },
      },
      movie: {
        select: {
          id: true,
          title: true,
          posterUrl: true,
          year: true,
        },
      },
      _count: {
        select: {
          reviewLikes: true,
          children: true,
        },
      },
    },
    orderBy: [{ likes: "desc" }, { createdAt: "desc" }],
  });
};

const approveReviewInDB = async (reviewId: string) => {
  const updatedReview = await prisma.review.update({
    where: { id: reviewId },
    data: { isApproved: true },
  });

  if (!updatedReview.parentId) {
    await updateMovieRating(updatedReview.movieId);
  }

  return updatedReview;
};

const unpublishReviewInDB = async (reviewId: string) => {
  const result = await prisma.review.update({
    where: { id: reviewId },
    data: { isApproved: false },
  });

  if (!result.parentId) {
    await updateMovieRating(result.movieId);
  }

  return result;
};

const deleteReviewByAdminFromDB = async (reviewId: string) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: {
      id: true,
      movieId: true,
      parentId: true,
      isApproved: true,
    },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  await prisma.$transaction(async (tx) => {
    await deleteReviewTree(tx, reviewId);
  });

  if (!review.parentId && review.isApproved) {
    await updateMovieRating(review.movieId);
  }
};

const toggleReviewLike = async (userId: string, reviewId: string) => {
  return prisma.$transaction(async (tx) => {
    const existingLike = await tx.reviewLike.findUnique({
      where: {
        userId_reviewId: { userId, reviewId },
      },
    });

    if (existingLike) {
      await tx.reviewLike.delete({
        where: {
          userId_reviewId: { userId, reviewId },
        },
      });

      const likes = await syncReviewLikeCount(tx, reviewId);
      return { liked: false, likes };
    }

    await tx.reviewLike.create({
      data: { userId, reviewId },
    });

    const likes = await syncReviewLikeCount(tx, reviewId);
    return { liked: true, likes };
  });
};

const updateMyReviewInDB = async (
  userId: string,
  reviewId: string,
  payload: Partial<Review>,
) => {
  const isExist = await prisma.review.findUnique({ where: { id: reviewId } });

  if (!isExist) throw new Error("Review not found");
  if (isExist.userId !== userId) throw new Error("You can only edit your own reviews");
  if (isExist.isApproved) {
    throw new Error("You can only edit unpublished reviews.");
  }

  const updateData: Prisma.ReviewUpdateInput = {
    isApproved: false,
  };

  if (payload.comment !== undefined) {
    updateData.comment = payload.comment;
  }

  if (payload.isSpoiler !== undefined) {
    updateData.isSpoiler = payload.isSpoiler;
  }

  if (!isExist.parentId && payload.rating !== undefined) {
    updateData.rating = payload.rating;
  }

  if (payload.tags !== undefined) {
    updateData.tags = payload.tags;
  }

  const updatedReview = await prisma.review.update({
    where: { id: reviewId },
    data: updateData,
  });

  if (!updatedReview.parentId) {
    await updateMovieRating(updatedReview.movieId);
  }

  return updatedReview;
};

const deleteMyReviewFromDB = async (userId: string, reviewId: string) => {
  const isExist = await prisma.review.findUnique({ where: { id: reviewId } });

  if (!isExist) throw new Error("Review not found");
  if (isExist.userId !== userId) {
    throw new Error("You can only delete your own reviews");
  }
  if (isExist.isApproved) {
    throw new Error("You can only delete unpublished reviews.");
  }

  await prisma.$transaction(async (tx) => {
    await deleteReviewTree(tx, reviewId);
  });
};

export const ReviewService = {
  createReviewInDB,
  getApprovedReviewsByMovie,
  getReviewsFromDB,
  getFeaturedReviewsFromDB,
  approveReviewInDB,
  unpublishReviewInDB,
  deleteReviewByAdminFromDB,
  toggleReviewLike,
  updateMyReviewInDB,
  deleteMyReviewFromDB,
};
