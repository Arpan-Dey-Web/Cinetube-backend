import { catchAsync } from "../../../utils/catchAsync.js";
import { sendResponse } from "../../../utils/sendResponse.js";
import { getMovieStatus, withMovieStatus } from "../../../utils/access.js";
import { MovieService } from "./movie.service.js";
import { PurchaseService } from "../purchase/purchase.service.js";
const getAllMovies = catchAsync(async (req, res) => {
    const userRole = req.user?.role;
    const result = await MovieService.getAllMoviesFromDB(req.query, userRole);
    sendResponse(res, {
        httpStatusCode: 200,
        success: true,
        message: "Movies fetched successfully",
        meta: result.meta,
        data: result.data,
    });
});
const getMovieGenres = catchAsync(async (_req, res) => {
    const result = await MovieService.getMovieGenresFromDB();
    sendResponse(res, {
        httpStatusCode: 200,
        success: true,
        message: "Genres fetched successfully",
        data: result,
    });
});
const getMovieById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const movie = await MovieService.getSingleMovieFromDB(id);
    if (!movie) {
        return sendResponse(res, {
            httpStatusCode: 404,
            success: false,
            message: "Movie not found",
            data: null,
        });
    }
    let hasAccess = getMovieStatus(movie.price) === "FREE";
    // Admin bypass
    if (user?.role === "ADMIN") {
        hasAccess = true;
    }
    // Normal user access check
    else if (user?.id && !hasAccess) {
        hasAccess = await PurchaseService.checkMovieAccess(user.id, user.role, id);
    }
    sendResponse(res, {
        httpStatusCode: 200,
        success: true,
        message: "Movie fetched successfully",
        data: withMovieStatus({
            ...movie,
            hasAccess,
            streamingUrl: hasAccess ? movie.streamingUrl : null,
        }),
    });
});
const createMovie = catchAsync(async (req, res) => {
    const movie = await MovieService.createMovieInDB(req.body);
    sendResponse(res, {
        httpStatusCode: 201,
        success: true,
        message: "Movie created successfully",
        data: movie,
    });
});
const updateMovie = catchAsync(async (req, res) => {
    const { id } = req.params;
    const updated = await MovieService.updateMovieInDB(id, req.body);
    sendResponse(res, {
        httpStatusCode: 200,
        success: true,
        message: "Movie updated successfully",
        data: updated,
    });
});
const deleteMovie = catchAsync(async (req, res) => {
    const { id } = req.params;
    const deleted = await MovieService.deleteMovieFromDB(id);
    sendResponse(res, {
        httpStatusCode: 200,
        success: true,
        message: "Movie deleted successfully",
        data: deleted,
    });
});
export const MovieController = {
    getAllMovies,
    getMovieGenres,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie,
};
//# sourceMappingURL=movie.controller.js.map