import { Router } from "express";
import {
  getRecette,
  postRecette,
  addRec,
} from "../Controller/recetteController";

const routerRecette = Router();

routerRecette.get("/", getRecette);
routerRecette.post("/", [], postRecette);
routerRecette.post("/addRec", [], addRec);

export default routerRecette;
