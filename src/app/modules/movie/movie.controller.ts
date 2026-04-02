import { Request, Response } from "express";
import { MovieService } from "./movie.service";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { PurchaseService } from "../purchase/purchase.service";

const getAllMovies = catchAsync(async (req: Request, res: Response) => {
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






const getMovieById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user; 

  const movie = await MovieService.getSingleMovieFromDB(id as string);
  
  if (!movie) {
    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Movie not found",
      data: null,
    })
    return;
  }

  let hasAccess = false;

  if (movie.status === "FREE") {
    hasAccess = true; 
  } else if (user?.role === "ADMIN") {
    hasAccess = true; 
  } else if (user?.id) {
    hasAccess = await PurchaseService.checkMovieAccess(user.id, user.role, id as string);
  }

  const responseData = {
    ...movie,
    hasAccess, 
  };

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Movie details fetched successfully",
    data: responseData,
  });
});





const createMovie = catchAsync(async (req: Request, res: Response) => {
  const result = await MovieService.createMovieInDB(req.body);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Movie created successfully",
    data: result,
  });
});

const updateMovie = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await MovieService.updateMovieInDB(id as string, req.body);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Movie updated successfully",
    data: result,
  });
});

const deleteMovie = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await MovieService.deleteMovieFromDB(id as string);

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
