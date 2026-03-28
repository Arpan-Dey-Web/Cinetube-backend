import { Movie } from "../../../generated/client";
import { prisma } from "../../../lib/prisma";

const getAllMoviesFromDB = async (query: Record<string, any>) => {
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
  
    // 1. Calculate Pagination
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
  
    // 2. Build the "Where" conditions
    const whereConditions: any = { isPublished: true };
  
    // Global Search (Title, Director, or Cast)
    if (searchTerm) {
      whereConditions.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { director: { contains: searchTerm, mode: 'insensitive' } },
        { cast: { hasSome: [searchTerm] } }, // Checks if any cast member matches
      ];
    }
  
    // Filter by Genre (Postgres Array Check)
    if (genres) {
      whereConditions.genres = { has: genres };
    }
  
    // Filter by Platform or Status
    if (platform) whereConditions.platform = platform;
    if (status) whereConditions.status = status;
  
    // 3. Execute Query & Get Total Count for Meta
    const [result, total] = await Promise.all([
      prisma.movie.findMany({
        where: whereConditions,
        skip,
        take,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.movie.count({ where: whereConditions }),
    ]);
  
    // 4. Calculate Meta Data
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
            select: { name: true, image: true, role: true } 
          } 
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
        isPublished: false, 
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