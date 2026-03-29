import { Router } from "express";
import { MovieController } from "./movie.controller";
import { auth } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { MovieValidation } from "./movie.validation";
import { Role } from "../../../enums/enum";

const movieRouter = Router();

movieRouter.get("/", MovieController.getAllMovies);

movieRouter.get("/:id", MovieController.getMovieById);

movieRouter.post(
  "/create-movie",
  auth(Role.Admin),
  validateRequest(MovieValidation.createMovieSchema),
  MovieController.createMovie,
);

movieRouter.put(
  "/update-movie/:id",
  auth(Role.Admin),
  validateRequest(MovieValidation.updateMovieSchema),
  MovieController.updateMovie,
);

movieRouter.delete("/:id",
    auth(Role.Admin),
    MovieController.deleteMovie);
    

export default movieRouter;
