const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sessionModel = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  listOfRecRecettes: [
    {
      recette: mongoose.Types.ObjectId,
      like: { type: Boolean },
    },
  ],
  date: { type: Date, required: true },
});

module.exports = mongoose.model("Session", sessionModel);
