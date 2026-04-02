import { Movie } from "../../../generated/client";
import { prisma } from "../../../lib/prisma";

const getAllMoviesFromDB = async (query: Record<string, any>, userRole?: string) => {
  const { 
    searchTerm, 
    genres, 
    platform, 
    status, 
    page = 1, 
    limit = 10, 
    sortBy = 'createdAt', 
    sortOrder = 'desc' 
  } = query;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  // 1. DYNAMIC Visibility Logic
  // We start with an empty object.
  const whereConditions: any = {};

  // If the user is NOT an Admin, they are restricted to ONLY published movies.
  // If they ARE an Admin, this condition is skipped, allowing them to see drafts.
  if (userRole !== "ADMIN") {
    whereConditions.isPublished = true;
  }

  // 2. Global Search
  if (searchTerm) {
    whereConditions.OR = [
      { title: { contains: searchTerm, mode: 'insensitive' } },
      { director: { contains: searchTerm, mode: 'insensitive' } },
      { cast: { hasSome: [searchTerm] } }, 
    ];
  }

  // 3. Filters
  if (genres) {
    whereConditions.genres = { has: genres };
  }
  if (platform) whereConditions.platform = platform;
  if (status) whereConditions.status = status;

  // 4. Execution
  const [result, total] = await Promise.all([
    prisma.movie.findMany({
      where: whereConditions,
      skip,
      take,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.movie.count({ where: whereConditions }),
  ]);

  const totalPages = Math.ceil(total / take);

  return {
    meta: {
      page: Number(page),
      limit: take,
      total,
      totalPages,
    },
    data: result,
  };
};

const getSingleMovieFromDB = async (id: string) => {
  return await prisma.movie.findUnique({
    where: { id },
    include: {
      reviews: {
        where: { isApproved: true },
        include: { 
          user: { 
            select: { 
              name: true, 
              image: true, 
              role: true 
            } 
          } 
        },
        orderBy: {
          createdAt: 'desc' 
        }
      }
    }
  });
};



const createMovieInDB = async (movieData: Partial<Movie>): Promise<Movie> => {
    const {
      title,
      description,
      director,
      cast,
      year,
      duration,
      genres,
      posterUrl,
      backdropUrl,
      trailerUrl,
      streamingUrl,
      platform,
      status,
      price,
      isTrending,
    } = movieData;
  
    const result = await prisma.movie.create({
      data: {
        title: title!,
        description: description!,
        director: director!,
        cast: Array.isArray(cast) ? cast : cast ? [cast as string] : [],
        genres: Array.isArray(genres) ? genres : genres ? [genres as string] : [],
        year: year!,
        duration: duration!,
        posterUrl: posterUrl!,
        backdropUrl: backdropUrl || "", 
        trailerUrl: trailerUrl || "",
        streamingUrl: streamingUrl || null,
        platform: platform || "Flicks Original",
        status: status || "FREE",
        price: price ? Number(price) : 0,
        isPublished: movieData.isPublished ?? false, 
        isTrending: isTrending || false,
      },
    });
  
    return result;
  };
  


  const updateMovieInDB = async (id: string, payload: Partial<Movie>): Promise<Movie> => {
    // Check if movie exists first (Professional touch)
    const isExist = await prisma.movie.findUnique({ where: { id } });
    if (!isExist) {
      throw new Error("Movie not found!");
    }
    if (payload.price) payload.price = Number(payload.price);
  
    // Prepare arrays if they are being updated
    const updateData = { ...payload };
  
    if (payload.cast) {
      updateData.cast = Array.isArray(payload.cast) ? payload.cast : [payload.cast as string];
    }
    if (payload.genres) {
      updateData.genres = Array.isArray(payload.genres) ? payload.genres : [payload.genres as string];
    }
  
    const result = await prisma.movie.update({
      where: { id },
      data: updateData,
    });
  
    return result;
  };


const deleteMovieFromDB = async (id: string): Promise<Movie> => {
  const isExist = await prisma.movie.findUnique({ where: { id } });
  if (!isExist) {
    throw new Error("Movie not found!");
  }

  return await prisma.movie.delete({
    where: { id },
  });
};

export const MovieService = {
  getAllMoviesFromDB,
  getSingleMovieFromDB,
  createMovieInDB,
  updateMovieInDB,
  deleteMovieFromDB,
};