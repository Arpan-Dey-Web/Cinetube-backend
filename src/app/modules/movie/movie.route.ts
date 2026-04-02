import { Router } from "express";
import { MovieController } from "./movie.controller";
import { auth } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { MovieValidation } from "./movie.validation";
import { Role } from "../../../enums/enum";

const movieRouter = Router();

// Get All Movies Route
movieRouter.get("/", MovieController.getAllMovies);


// Get Movie by ID Route
movieRouter.get("/:id", MovieController.getMovieById);

// Create Movie Route
movieRouter.post(
  "/create-movie",
  auth(Role.Admin),
  validateRequest(MovieValidation.createMovieSchema),
  MovieController.createMovie,
);

// Update Movie Route
movieRouter.put(
  "/update-movie/:id",
  auth(Role.Admin),
  validateRequest(MovieValidation.updateMovieSchema),
  MovieController.updateMovie,
);

// Delete Movie Route
movieRouter.delete("/:id", auth(Role.Admin), MovieController.deleteMovie);

export default movieRouter;
