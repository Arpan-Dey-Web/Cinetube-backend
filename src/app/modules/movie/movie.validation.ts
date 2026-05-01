import { z } from "zod";

const booleanish = z
  .union([z.boolean(), z.enum(["true", "false"])])
  .transform((value) => value === true || value === "true");

const numberish = z
  .union([z.string(), z.number()])
  .transform((value) => Number(value));

const movieDataSchema = z.object({
  title: z.string({ message: "Title is required" }),
  description: z.string().min(10, "Description must be at least 10 chars"),
  director: z.string({ message: "Director is required" }),
  cast: z.array(z.string()),
  year: z.string(),
  duration: z.string(),
  genres: z.array(z.string()),
  posterUrl: z.string().url("Invalid poster URL"),
  backdropUrl: z.string().url("Invalid backdrop URL"),
  trailerUrl: z.string().url("Invalid trailer URL"),
  streamingUrl: z
    .string()
    .url("Invalid streaming URL")
    .or(z.literal(""))
    .nullable()
    .optional(),
  platform: z.string().optional(),
  status: z.enum(["FREE", "PREMIUM"]),
  price: z.number().nonnegative().default(0),
  isPublished: z.boolean().default(false),
  isTrending: z.boolean().default(false),
});

const createMovieSchema = z.object({
  body: movieDataSchema,
});

const updateMovieSchema = z.object({
  body: movieDataSchema.partial(),
});

const getAllMoviesQuerySchema = z.object({
  query: z.object({
    searchTerm: z.string().optional(),
    genres: z.union([z.string(), z.array(z.string())]).optional(),
    platform: z.string().optional(),
    status: z.enum(["FREE", "PREMIUM"]).optional(),
    year: z.string().optional(),
    minRating: numberish.optional(),
    maxRating: numberish.optional(),
    page: numberish.optional(),
    limit: numberish.optional(),
    sortBy: z
      .enum([
        "createdAt",
        "rating",
        "price",
        "title",
        "year",
        "mostReviewed",
        "popularity",
        "latest",
        "highestRated",
      ])
      .optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
    filter: z.enum(["featured", "trending", "newly-added", "top-rated"]).optional(),
    isTrending: booleanish.optional(),
    isPublished: booleanish.optional(),
  }),
});

export const MovieValidation = {
  createMovieSchema,
  updateMovieSchema,
  getAllMoviesQuerySchema,
};
