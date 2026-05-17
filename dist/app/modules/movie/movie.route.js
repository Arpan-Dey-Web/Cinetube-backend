import { Router } from "express";
import { Role } from "../../../enums/enum.js";
import { auth, optionalAuth } from "../../middleware/auth.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { MovieController } from "./movie.controller.js";
import { MovieValidation } from "./movie.validation.js";
const movieRouter = Router();
movieRouter.get("/", optionalAuth(), validateRequest(MovieValidation.getAllMoviesQuerySchema), MovieController.getAllMovies);
movieRouter.get("/genres", MovieController.getMovieGenres);
movieRouter.get("/:id", optionalAuth(), MovieController.getMovieById);
movieRouter.post("/", auth(Role.Admin), validateRequest(MovieValidation.createMovieSchema), MovieController.createMovie);
movieRouter.patch("/:id", auth(Role.Admin), validateRequest(MovieValidation.updateMovieSchema), MovieController.updateMovie);
movieRouter.post("/create-movie", auth(Role.Admin), validateRequest(MovieValidation.createMovieSchema), MovieController.createMovie);
movieRouter.patch("/update-movie/:id", auth(Role.Admin), validateRequest(MovieValidation.updateMovieSchema), MovieController.updateMovie);
movieRouter.delete("/:id", auth(Role.Admin), MovieController.deleteMovie);
export default movieRouter;
//# sourceMappingURL=movie.route.js.map