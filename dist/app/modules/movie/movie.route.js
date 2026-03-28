import { Router } from "express";
import { MovieController } from "./movie.controller.js";
const movieRouter = Router();
movieRouter.get("/", MovieController.getAllMovies);
movieRouter.get("/:id", MovieController.getMovieById);
movieRouter.post("/create-movie", MovieController.createMovie);
movieRouter.put("/update-movie/:id", MovieController.updateMovie);
movieRouter.delete("/:id", MovieController.deleteMovie);
export default movieRouter;
//# sourceMappingURL=movie.route.js.map