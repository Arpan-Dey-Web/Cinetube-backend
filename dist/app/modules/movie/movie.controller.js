import { MovieService } from "./movie.service.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { sendResponse } from "../../../utils/sendResponse.js";
const getAllMovies = catchAsync(async (req, res) => {
    const result = await MovieService.getAllMoviesFromDB(req.query);
    sendResponse(res, {
        httpStatusCode: 200,
        success: true,
        message: "Movies fetched successfully",
        meta: result.meta,
        data: result.data,
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
// const getMovieById = catchAsync(async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const userId = req.user?.id; // Assuming you have auth middleware
//     const movie = await MovieService.getSingleMovieFromDB(id);
//     if (!movie) throw new Error("Movie not found");
//     // Editorial Logic: Hide the streaming URL if it's Premium and user hasn't paid
//     let hasAccess = false;
//     if (movie.status === "FREE") {z
//       hasAccess = true;
//     } else if (userId) {
//       hasAccess = await PurchaseService.checkMovieAccess(userId, movie.id);
//     }
//     const responseData = {
//       ...movie,
//       // If no access, we redact the streaming URL for security
//       streamingUrl: hasAccess ? movie.streamingUrl : null,
//       hasAccess, 
//     };
//     sendResponse(res, {
//       httpStatusCode: 200,
//       success: true,
//       message: "Movie details fetched",
//       data: responseData,
//     });
//   });
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