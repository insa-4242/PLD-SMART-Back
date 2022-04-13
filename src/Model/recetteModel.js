import { Schema, model } from "mongoose";

const recetteModel = new Schema({
  instruction: { type: String },
});

module.exports = model("Recette", recetteModel);
