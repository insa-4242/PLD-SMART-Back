const express = require("express");
const routerRecette = express.Router();
const recetteController = require("../Controller/recetteController");

routerRecette.get("/", recetteController.getRecette);
routerRecette.post("/", [], recetteController.postRecette);
routerRecette.post("/addRec", [], recetteController.addRec);

module.exports = routerRecette;
