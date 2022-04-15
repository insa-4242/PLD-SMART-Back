import { Schema, model } from "mongoose";

const recetteModel = new Schema({
  //on a besoin d'une objectID pour chaque entité ou est-ce que c'est crée automatiquement? :non, Cest à mongoose de la créer
  marmitonUrl: { type: String, required: true },
  marmitonId: { type: String, required: true, unique: true },
  imagesUrls: [{ type: String }],
  categories: [{ type: String }],
  title: { type: String, required: true },
  preparationTime: { type: Number },
  cookingTime: { type: Number },
  restTime: { type: Number },
  totalTime: { type: Number },
  rating: { type: Number },
  ratingCount: { type: Number },
  cost: { type: Number },
  difficulty: { type: Number },
  isSeasonal: { type: Boolean, required: true },
  isGlutenFree: { type: Boolean, required: true },
  isLactoseFree: { type: Boolean, required: true },
  isVegetarian: { type: Boolean, required: true },
  isVegan: { type: Boolean, required: true },
  isPorkFree: { type: Boolean, required: true },
  isSweet: { type: Boolean, required: true },
  isSalty: { type: Boolean, required: true },
  instructions: [
    {
      _id: false,
      text: { type: String },
      position: { type: Number },
      duration: { type: Number },
      isPreparationStep: { type: Boolean },
      isCookingStep: { type: Boolean },
      isRestStep: { type: Boolean },
      ingredientsStep: [
        {
          name: { type: String },
          imgUrl: { type: String },
          _id: false,
        },
      ],
    },
  ],
  preferredNumberIngr: { type: Number },
  ingredients: [
    {
      idIngredient: { type: Schema.Types.ObjectId, ref: "Ingredient" },
      quantity: { type: Number },
      unit: { type: String },
      _id: false,
    },
  ],
  utensils: [
    {
      idUtensil: { type: Schema.Types.ObjectId, ref: "Utensil" },
      quantity: { type: Number },
      _id: false,
    },
  ],
  nutriScore: { type: String },
  ecoScore: { type: String },
  utensiles: [{ idUtensile: Schema.Types.ObjectId }],
  author: { type: String, required: true },
  type: { type: String },
});

module.exports = model("Recette", recetteModel);
