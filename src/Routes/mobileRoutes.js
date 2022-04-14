import { Router } from "express";
import { getRecettebyId } from "../Controller/mobileController";
const { check, isISO8601 } = require("express-validator");

const routerMobile = Router();

routerMobile.get(
  "/namesearch",
  [check("keyword").not().isEmpty(), check("keyword").isString()],
  getRecettebyId
);
routerMobile.get("/:id", getRecettebyId);

export default routerMobile;
