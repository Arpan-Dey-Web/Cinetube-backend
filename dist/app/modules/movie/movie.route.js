import { Router } from "express";
import { MovieController } from "./movie.controller.js";
import { auth } from "../../middleware/auth.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { MovieValidation } from "./movie.validation.js";
import { Role } from "../../../enums/enum.js";
const movieRouter = Router();
movieRouter.get("/", MovieController.getAllMovies);
movieRouter.get("/:id", MovieController.getMovieById);
movieRouter.post("/create-movie", auth(Role.Admin), validateRequest(MovieValidation.createMovieSchema), MovieController.createMovie);
movieRouter.put("/update-movie/:id", auth(Role.Admin), validateRequest(MovieValidation.updateMovieSchema), MovieController.updateMovie);
movieRouter.delete("/:id", auth(Role.Admin), MovieController.deleteMovie);
export default movieRouter;
//# sourceMappingURL=movie.route.js.map