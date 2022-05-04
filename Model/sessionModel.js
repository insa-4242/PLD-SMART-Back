const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sessionModel = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isFull: { type: Boolean },
  listOfRecRecettes: [
    {
      recette: {
        type: mongoose.Types.ObjectId,
        ref: "Recette",
      },
      status: {
        type: String,
        enum: ["UNSEEN", "SEEN"],
        default: "UNSEEN",
      },
      like: { type: Boolean },
      _id: false,
    },
  ],
  date: { type: Date, required: true },
  liked: { type: Number }, //l+
  seenNotLiked: { type: Number }, //l-
  vegeLPlus: { type: Number },
  sweetLPlus: { type: Number },
});

module.exports = mongoose.model("Session", sessionModel);
