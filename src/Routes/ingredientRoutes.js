import { Router } from "express";
import { postIngredients } from "../Controller/ingredientController";

const routerIngredient = Router();

routerIngredient.post("/", [], postIngredients);

export default routerIngredient;
