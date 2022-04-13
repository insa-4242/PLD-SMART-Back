import { Schema, model } from "mongoose";

const recetteModel = new Schema({
  //on a besoin d'une objectID pour chaque entité ou est-ce que c'est crée automatiquement? :non, Cest à mongoose de la créer
  marmitonID: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String },

  duration: { type: Number, min: 0, required: true },

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
      type: String,
    },
  ],
  ingredients: [
    {
      idIngredient: { type: Schema.Types.ObjectId },
      required: true,
      quantity: { type: Number },
      unit: { type: String }, //unit as a string or define object?
    },
  ],
  utensiles: [{ idUtensile: Schema.Types.ObjectId }],
});

module.exports = model("Recette", recetteModel);
