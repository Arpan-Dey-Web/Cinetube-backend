import { z } from "zod";

const createReviewSchema = z.object({
  body: z.object({
    rating: z
      .number({ message: "Rating is required" })
      .int("Rating must be a whole number")
      .min(1, "Minimum rating is 1")
      .max(10, "Maximum rating is 10"),
    comment: z
      .string({ message: "Comment is required" })
      .min(10, "Comment must be at least 10 characters long"),
    movieId: z.string({ message: "Movie ID is required" }),
    isSpoiler: z.boolean().optional().default(false),
    parentId: z.string().optional().nullable(), // For threaded replies
  }),
});

const updateReviewSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(10).optional(),
    comment: z.string().min(10).optional(),
    isSpoiler: z.boolean().optional(),
    isApproved: z.boolean().optional(), // Admin-only toggle
  }),
});

export const ReviewValidation = {
  createReviewSchema,
  updateReviewSchema,
};