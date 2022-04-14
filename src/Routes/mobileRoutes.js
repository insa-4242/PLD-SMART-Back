import { Router } from "express";
import {
  getRecettebyId,
  autocompleteIngr,
  searchByName,
  autocompleteNameRecette,
} from "../Controller/mobileController";
const { check, isISO8601 } = require("express-validator");

const routerMobile = Router();

routerMobile.get(
  "/namesearch",
  [check("keyword").not().isEmpty(), check("keyword").isString()],
  searchByName
);
routerMobile.get(
  "/autocomplete/ingredient",
  [check("keyword").not().isEmpty(), check("keyword").isString()],
  autocompleteIngr
);
routerMobile.get(
  "/autocomplete/recetteName",
  [check("keyword").not().isEmpty(), check("keyword").isString()],
  autocompleteNameRecette
);
routerMobile.get("/:id", getRecettebyId);

export default routerMobile;
