import { prisma } from "../../../lib/prisma";
import { Prisma, Movie } from "../../../generated/client";
import { withMovieStatus } from "../../../utils/access";


const getAllMoviesFromDB = async (
  query: Record<string, unknown>,
  userRole?: string,
) => {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 10);
  const skip = (page - 1) * limit;

  const where: Prisma.MovieWhereInput = {};

  if (userRole !== "ADMIN") {
    where.isPublished = true;
  }

  if (query.status === "FREE") {
    where.price = { lte: 0 };
  }

  if (query.status === "PREMIUM") {
    where.price = { gt: 0 };
  }

  const [data, total] = await Promise.all([
    prisma.movie.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.movie.count({ where }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: data.map((movie) => withMovieStatus(movie)),
  };
};


const getSingleMovieFromDB = async (id: string) => {
  return prisma.movie.findUnique({
    where: { id },
    include: {
      reviews: {
        where: { isApproved: true },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
};


const getMovieGenresFromDB = async () => {
  const movies = await prisma.movie.findMany({
    where: { isPublished: true },
    select: { genres: true },
  });

  const map: Record<string, number> = {};

  movies.forEach((movie) => {
    movie.genres.forEach((g) => {
      map[g] = (map[g] || 0) + 1;
    });
  });

  return Object.entries(map).map(([name, count]) => ({
    name,
    count,
  }));
};


const createMovieInDB = async (payload: any) => {
  return prisma.movie.create({
    data: {
      ...payload,
      price: Number(payload.price || 0),
    },
  });
};


const updateMovieInDB = async (id: string, payload: any) => {
  return prisma.movie.update({
    where: { id },
    data: payload,
  });
};


const deleteMovieFromDB = async (id: string) => {
  return prisma.movie.delete({
    where: { id },
  });
};

export const MovieService = {
  getAllMoviesFromDB,
  getSingleMovieFromDB,
  getMovieGenresFromDB,
  createMovieInDB,
  updateMovieInDB,
  deleteMovieFromDB,
};
