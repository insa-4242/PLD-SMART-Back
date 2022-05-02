const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userModel = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  password: { type: String },
});

module.exports = mongoose.model("User", userModel);
