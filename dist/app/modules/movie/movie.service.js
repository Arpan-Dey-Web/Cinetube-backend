import { prisma } from "../../../lib/prisma.js";
import { withMovieStatus } from "../../../utils/access.js";
const getAllMoviesFromDB = async (query, userRole) => {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 10);
    const skip = (page - 1) * limit;
    const where = {};
    const search = String(query.search || query.searchTerm || "").trim();
    const filter = String(query.filter || "");
    const sortBy = String(query.sortBy || "");
    const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";
    if (userRole !== "ADMIN") {
        where.isPublished = true;
    }
    if (search) {
        where.OR = [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { director: { contains: search, mode: "insensitive" } },
        ];
    }
    if (query.genres) {
        const genres = Array.isArray(query.genres)
            ? query.genres.map(String)
            : String(query.genres).split(",");
        where.genres = { hasSome: genres.map((genre) => genre.trim()).filter(Boolean) };
    }
    if (query.platform) {
        where.platform = String(query.platform);
    }
    if (query.year) {
        where.year = String(query.year);
    }
    if (query.minRating || query.maxRating) {
        where.rating = {
            ...(query.minRating ? { gte: Number(query.minRating) } : {}),
            ...(query.maxRating ? { lte: Number(query.maxRating) } : {}),
        };
    }
    if (query.status === "FREE") {
        where.price = { lte: 0 };
    }
    if (query.status === "PREMIUM") {
        where.price = { gt: 0 };
    }
    if (query.isTrending === true || query.trending === true || filter === "trending") {
        where.isTrending = true;
    }
    if (query.isPublished !== undefined && userRole === "ADMIN") {
        where.isPublished = Boolean(query.isPublished);
    }
    const orderBy = [];
    if (query["top-rated"] === true || filter === "top-rated" || sortBy === "highestRated") {
        orderBy.push({ rating: "desc" });
    }
    else if (query["newly-added"] === true || filter === "newly-added" || sortBy === "latest") {
        orderBy.push({ createdAt: "desc" });
    }
    else if (sortBy === "rating") {
        orderBy.push({ rating: sortOrder });
    }
    else if (["createdAt", "price", "title", "year"].includes(sortBy)) {
        orderBy.push({ [sortBy]: sortOrder });
    }
    else {
        orderBy.push({ createdAt: "desc" });
    }
    if (query.featured === true || filter === "featured") {
        orderBy.unshift({ isTrending: "desc" }, { rating: "desc" });
    }
    const [data, total] = await Promise.all([
        prisma.movie.findMany({
            where,
            skip,
            take: limit,
            orderBy,
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
const getSingleMovieFromDB = async (id) => {
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
    const map = {};
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
const createMovieInDB = async (payload) => {
    const { status: _status, ...movieData } = payload;
    return prisma.movie.create({
        data: {
            ...movieData,
            price: Number(payload.price || 0),
        },
    });
};
const updateMovieInDB = async (id, payload) => {
    return prisma.movie.update({
        where: { id },
        data: payload,
    });
};
const deleteMovieFromDB = async (id) => {
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
//# sourceMappingURL=movie.service.js.map