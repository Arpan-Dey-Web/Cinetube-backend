import { z } from "zod";

const numberish = z
  .union([z.string(), z.number()])
  .transform((value) => Number(value));

const createReviewBodySchema = z
  .object({
    rating: z
      .number()
      .int("Rating must be a whole number")
      .min(1, "Minimum rating is 1")
      .max(10, "Maximum rating is 10")
      .optional(),
    comment: z
      .string({ message: "Comment is required" })
      .min(3, "Comment must be at least 3 characters long"),
    movieId: z.string({ message: "Movie ID is required" }),
    tags: z.array(z.string().min(1)).max(8).optional().default([]),
    isSpoiler: z.boolean().optional().default(false),
    parentId: z.string().optional().nullable(),
  })
  .superRefine((value, ctx) => {
    if (!value.parentId && value.rating === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rating"],
        message: "Rating is required for a review.",
      });
    }
  });

const createReviewSchema = z.object({
  body: createReviewBodySchema,
});

const updateReviewSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(10).optional(),
    comment: z.string().min(3).optional(),
    tags: z.array(z.string().min(1)).max(8).optional(),
    isSpoiler: z.boolean().optional(),
  }),
});

const moderateReviewSchema = z.object({
  body: z.object({
    isApproved: z.boolean(),
  }),
});

const getReviewsQuerySchema = z.object({
  query: z.object({
    movieId: z.string().optional(),
    userId: z.enum(["me"]).optional(),
    status: z.enum(["PENDING", "APPROVED", "ALL"]).optional(),
    page: numberish.optional(),
    limit: numberish.optional(),
  }),
});

export const ReviewValidation = {
  createReviewSchema,
  updateReviewSchema,
  moderateReviewSchema,
  getReviewsQuerySchema,
};
