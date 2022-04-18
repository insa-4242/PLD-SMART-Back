const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const utensilModel = new Schema({
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

module.exports = mongoose.model("Utensil", utensilModel);
