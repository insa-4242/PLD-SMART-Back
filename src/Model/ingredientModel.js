import { Schema, model } from "mongoose";

const ingredientModel = new Schema({
  name: { type: String, required: true, unique: true },
  imageUrl: { type: String },
});

module.exports = model("Ingredient", ingredientModel);
