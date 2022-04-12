import { Router } from "express";
import { getRecette, postRecette } from "../Controller/recetteController";

const routerRecette = Router();

routerRecette.get("/", getRecette);
routerRecette.post("/", postRecette);

export default routerRecette;
