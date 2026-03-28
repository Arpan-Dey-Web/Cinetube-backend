import { prisma } from "../../../lib/prisma.js";
const getAllMoviesFromDB = async (query) => {
    return await prisma.movie.findMany({
        where: {
            isPublished: true,
        },
        orderBy: { createdAt: 'desc' }
    });
};
const getSingleMovieFromDB = async (id) => {
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
const createMovieInDB = async (movieData) => {
    const { title, description, director, cast, year, duration, genres, posterUrl, backdropUrl, trailerUrl, streamingUrl, platform, status, price, isTrending, } = movieData;
    const result = await prisma.movie.create({
        data: {
            title: title,
            description: description,
            director: director,
            cast: Array.isArray(cast) ? cast : cast ? [cast] : [],
            genres: Array.isArray(genres) ? genres : genres ? [genres] : [],
            year: year,
            duration: duration,
            posterUrl: posterUrl,
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
const updateMovieInDB = async (id, payload) => {
    // Check if movie exists first (Professional touch)
    const isExist = await prisma.movie.findUnique({ where: { id } });
    if (!isExist) {
        throw new Error("Movie not found!");
    }
    // Prepare arrays if they are being updated
    const updateData = { ...payload };
    if (payload.cast) {
        updateData.cast = Array.isArray(payload.cast) ? payload.cast : [payload.cast];
    }
    if (payload.genres) {
        updateData.genres = Array.isArray(payload.genres) ? payload.genres : [payload.genres];
    }
    const result = await prisma.movie.update({
        where: { id },
        data: updateData,
    });
    return result;
};
const deleteMovieFromDB = async (id) => {
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
//# sourceMappingURL=movie.service.js.map