import { Schema, model } from "mongoose";

const recetteModel = new Schema({
  //on a besoin d'une objectID pour chaque entité ou est-ce que c'est crée automatiquement? :non, Cest à mongoose de la créer
  marmitonUrl: { type: String, required: true, unique: true },
  imageUrls: [{ type: String }],
  category: { type: String },
  title: { type: String, required: true },
  datePublished: { type: Date, required: true },
  prepTime: { type: Number },
  cookTime: { type: Number },
  totalTime: { type: Number },
  difficulty: {
    type: String, //easy medium hard --> difficulty object
    enum: ["facile", "moyen", "difficile"],
  },
  isVegetarian: { type: Boolean, required: true },
  isVegan: { type: Boolean, required: true },
  isLactoseFree: { type: Boolean, required: true },
  isGlutenFree: { type: Boolean, required: true },
  instructions: [
    {
      "@type": {
        type: String,
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
    },
  ],
  ingredients: [
    {
      idIngredient: { type: Schema.Types.ObjectId, ref: "Ingredient" },
      quantity: { type: Number },
      unit: { type: String }, //unit as a string or define object?
    },
  ],
  utensiles: [{ idUtensile: Schema.Types.ObjectId }],
  author: { type: String, required: true },
  description: [{ type: String, required: true }],
  keywords: [{ type: String, required: true }],
  type: { type: String },
  note: {
    "@type": { type: String, required: true },
    reviewCount: { type: Number, required: true },
    ratingValue: { type: Number, required: true },
    worstRating: { type: Number, required: true },
    bestRating: { type: Number, required: true },
  },
});

module.exports = model("Recette", recetteModel);
