
import { Router } from "express";
import { MovieController } from "./movie.controller.js";


const router = Router();

router.get("/", MovieController.getAllMovies);
router.post("/create-movie", MovieController.createMovie);

export const movieRoutes = router;