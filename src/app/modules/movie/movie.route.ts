import { Router } from "express";
import { Role } from "../../../enums/enum";
import { auth, optionalAuth } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { MovieController } from "./movie.controller";
import { MovieValidation } from "./movie.validation";

const movieRouter = Router();

movieRouter.get(
  "/",
  optionalAuth(),
  validateRequest(MovieValidation.getAllMoviesQuerySchema),
  MovieController.getAllMovies,
);

movieRouter.get("/genres", MovieController.getMovieGenres);

movieRouter.get("/:id", optionalAuth(), MovieController.getMovieById);

movieRouter.post(
  "/",
  auth(Role.Admin),
  validateRequest(MovieValidation.createMovieSchema),
  MovieController.createMovie,
);

movieRouter.patch(
  "/:id",
  auth(Role.Admin),
  validateRequest(MovieValidation.updateMovieSchema),
  MovieController.updateMovie,
);

movieRouter.post(
  "/create-movie",
  auth(Role.Admin),
  validateRequest(MovieValidation.createMovieSchema),
  MovieController.createMovie,
);

movieRouter.patch(
  "/update-movie/:id",
  auth(Role.Admin),
  validateRequest(MovieValidation.updateMovieSchema),
  MovieController.updateMovie,
);

movieRouter.delete("/:id", auth(Role.Admin), MovieController.deleteMovie);

export default movieRouter;
