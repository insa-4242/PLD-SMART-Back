const Mongoose = require("mongoose");
const HttpError = require("../Model/util/httpError");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const UserModel = require("../Model/userModel");
const recetteModel = require("../Model/recetteModel");

const getreco = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Error input", 422));
  }

  //FAKE DATA
  try {
    products = await recetteModel
      .findById("625bdac6916c1071b45e77f3")
      .select(
        "_id, title , type , difficulty , totalTime , isVegetarian , isVegan , isLactoseFree , isGlutenFree , imagesUrls , totalTime "
      );
  } catch (err) {}

  res.status(201).json({ Recettes: [products, products, products, products] });
};

const postreco = async (req, res, next) => {
  res.status(201).json("uu");
};

exports.getreco = getreco;
exports.postreco = postreco;
