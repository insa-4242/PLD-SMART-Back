import { Schema, model } from "mongoose";

const addressModel = new Schema({
  instruction: { type: String },
});

module.exports = model("Address", addressModel);
