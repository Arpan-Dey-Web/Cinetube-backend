import { Request, Response } from "express";
import status from "http-status";
import { MovieService } from "./movie.service.js";

const createMovie = async (req: Request, res: Response) => {
    try {
        const result = await MovieService.createMovieToDB(req.body);

        res.status(status.CREATED).json({
            success: true,
            message: "Movie added successfully!",
            data: result,
        });
    } catch (error) {
        res.status(status.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to create movie"
        });
    }
};

const getAllMovies = async (req: Request, res: Response) => {
    try {
        const result = await MovieService.getAllMoviesFromDB();

        res.status(status.OK).json({
            success: true,
            message: "Movies fetched successfully",
            data: result,
        });
    } catch (error) {
        res.status(status.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error fetching movies"
        });
    }
};

export const MovieController = {
    createMovie,
    getAllMovies,
};