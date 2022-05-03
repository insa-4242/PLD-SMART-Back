const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userModel = new Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  sessions: [
    {
      sessionID: { type: mongoose.Types.ObjectId, ref: "Session" },
    },
  ],
  password: { type: String, required: true, minlength: 6 },
});

module.exports = mongoose.model("User", userModel);
