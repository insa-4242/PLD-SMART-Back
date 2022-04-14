const Mongoose = require("mongoose");
const { validationResult } = require("express-validator");

import recetteModel from "../Model/recetteModel";

import HttpError from "../Model/util/httpError";

const getRecettebyId = async (req, res, next) => {
  const idRecette = req.params.id;
  if (!idRecette) {
    const error = new HttpError("Please verify Syntax", 500);
    return next(error);
  }
  let existingRecette;
  try {
    existingRecette = await recetteModel.findById(idRecette);
  } catch (err) {
    console.log(err);
    const error = new HttpError("Ooops An error Occured", 500);
    return next(error);
  }
  if (!existingRecette) {
    const error = new HttpError("Don't have the right MF", 403);
    return next(error);
  }

  res.status(201).json({
    recette: existingRecette.toObject({ getters: true }),
  });
};

const searchByName = async (req, res, next) => {
  //Verify UserInput
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Error input", 422));
  }

  let products = [];
  try {
    products = await recetteModel
      .find(
        {
          $text: { $search: req.query.keyword },
        },
        { score: { $meta: "textScore" } }
      )
      .select("_id, title, ingredients")
      .populate({
        path: "ingredients",
        populate: {
          path: "idIngredient",
        },
      })
      .sort({ score: { $meta: "textScore" } });

    console.log(products);
  } catch (err) {
    console.log(err);
    return next(new HttpError("Error Server", 500));
  }
  res.status(201).json({
    recette: products.map((prod) => prod.toObject({ getters: true })),
  });
};

const searchByIngr = async (req, res, next) => {
  //Verify UserInput
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Error input", 422));
  }

  let products = [];
  try {
    products = await recetteModel
      .find(
        {
          $text: { $search: req.query.keyword },
        },
        { score: { $meta: "textScore" } }
      )
      .select("_id, title, ingredients")
      .populate({
        path: "ingredients",
        populate: {
          path: "idIngredient",
        },
      })
      .sort({ score: { $meta: "textScore" } });

    console.log(products);
  } catch (err) {
    console.log(err);
    return next(new HttpError("Error Server", 500));
  }
  res.status(201).json({
    recette: products.map((prod) => prod.toObject({ getters: true })),
  });
};

exports.getRecettebyId = getRecettebyId;
exports.getRecettebyId = searchByName;
exports.getRecettebyId = searchByIngr;
