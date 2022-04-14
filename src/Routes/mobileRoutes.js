import { Router } from "express";
import { getRecettebyId } from "../Controller/mobileController";

const routerMobile = Router();

routerMobile.get("/:id", getRecettebyId);

export default routerMobile;
