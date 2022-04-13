import { Schema, model } from "mongoose";

const ingredientModel = new Schema({
  marmitonID: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true },
  title: { type: String, required: true },
  isVegetarian: { type: Boolean, default: false },
  isVegan: { type: Boolean, default: false },
  isLactoseFree: { type: Boolean, default: false },
  isGlutenFree: { type: Boolean, default: false },
});

module.exports = model("Ingredient", ingredientModel);
