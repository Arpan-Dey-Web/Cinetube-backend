import { MovieService } from "./movie.service.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { sendResponse } from "../../../utils/sendResponse.js";
const getAllMovies = catchAsync(async (req, res) => {
    const result = await MovieService.getAllMoviesFromDB(req.query);
    sendResponse(res, {
        httpStatusCode: 200,
        success: true,
        message: "Movies fetched successfully",
        data: result,
    });
});
const getMovieById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await MovieService.getSingleMovieFromDB(id);
    if (!result) {
        throw new Error("Movie not found");
    }
    sendResponse(res, {
        httpStatusCode: 200,
        success: true,
        message: "Movie details fetched successfully",
        data: result,
    });
});
const createMovie = catchAsync(async (req, res) => {
    const result = await MovieService.createMovieInDB(req.body);
    sendResponse(res, {
        httpStatusCode: 201,
        success: true,
        message: "Movie created successfully",
        data: result,
    });
});
const updateMovie = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await MovieService.updateMovieInDB(id, req.body);
    sendResponse(res, {
        httpStatusCode: 200,
        success: true,
        message: "Movie updated successfully",
        data: result,
    });
});
const deleteMovie = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await MovieService.deleteMovieFromDB(id);
    sendResponse(res, {
        httpStatusCode: 200,
        success: true,
        message: "Movie deleted successfully",
        data: result,
    });
});
export const MovieController = {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie,
};
//# sourceMappingURL=movie.controller.js.map