const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sessionModel = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "Session",
    required,
  },
  date: { type: Date, required },
});

module.exports = mongoose.model("Session", sessionModel);
