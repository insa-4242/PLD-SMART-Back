import { Schema, model } from "mongoose";

const ingredientModel = new Schema({
  name: { type: String, required: true },
  marmitonId: { type: String, unique: true },
  imgUrl: { type: String },
  idsRecette: [
    {
      type: Schema.Types.ObjectId,
      ref: "Recette",
    },
  ],
});

module.exports = model("Ingredient", ingredientModel);
