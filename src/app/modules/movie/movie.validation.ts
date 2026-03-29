import { z } from "zod";

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
  streamingUrl: z.string().url().optional().nullable(),
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
    genre: z.string().optional(),
    limit: z.string().optional(), // These come as strings from the URL
    page: z.string().optional(),
  }),
});

export const MovieValidation = {
  createMovieSchema,
  updateMovieSchema, 
  getAllMoviesQuerySchema,
};