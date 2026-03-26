import type { Prisma } from "../../../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";

const createMovieToDB = async (payload: Prisma.MovieCreateInput) => {
    const result = await prisma.movie.create({
        data: payload,
    });
    return result;
};

const getAllMoviesFromDB = async () => {
    const result = await prisma.movie.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
    });
    return result;
};

export const MovieService = {
    createMovieToDB,
    getAllMoviesFromDB,
};
