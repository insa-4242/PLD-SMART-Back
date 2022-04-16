const Mongoose = require("mongoose");
const { validationResult } = require("express-validator");

import recetteModel from "../Model/recetteModel";
import ingredientModel from "../Model/ingredientModel";
import HttpError from "../Model/util/httpError";

const getRecettebyId = async (req, res, next) => {
  const idRecette = req.params.id;
  if (!idRecette) {
    const error = new HttpError("Please verify Syntax", 500);
    return next(error);
  }
  let existingRecette;
  try {
    existingRecette = await recetteModel.findById(idRecette).populate({
      path: "ingredients",
      populate: {
        path: "idIngredient",
      },
    });
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
    let msg = "";
    errors.array().forEach((element) => {
      msg += JSON.stringify(element);
    });
    return next(new HttpError(msg, 422));
  }

  const filter = req.query.correctFilter;
  let products = [];
  try {
    products = await recetteModel
      .find(
        {
          $text: { $search: req.query.keyword },
          ...(filter &&
            filter.type &&
            filter.type.length !== 0 && {
              type: { $in: filter.type },
            }),
          ...(filter &&
            filter.isVegetarian && {
              isVegetarian: true,
            }),
          ...(filter &&
            filter.isVegan && {
              isVegan: true,
            }),
          ...(filter &&
            filter.isLactoseFree && {
              isLactoseFree: true,
            }),
          ...(filter &&
            filter.isGlutenFree && {
              isGlutenFree: true,
            }),
          ...(filter &&
            filter.duration &&
            filter.duration.min &&
            !filter.duration.max && {
              totalTime: { $gte: filter.duration.min },
            }),
          ...(filter &&
            filter.duration &&
            filter.duration.max &&
            !filter.duration.min && {
              totalTime: { $lte: filter.duration.min },
            }),
          ...(filter &&
            filter.duration &&
            filter.duration.max &&
            filter.duration.min && {
              totalTime: {
                $lte: filter.duration.max,
                $gte: filter.duration.min,
              },
            }),
          ...(filter &&
            filter.difficulty &&
            filter.difficulty.min &&
            !filter.difficulty.max && {
              difficulty: { $gte: filter.difficulty.min },
            }),
          ...(filter &&
            filter.difficulty &&
            filter.difficulty.max &&
            !filter.difficulty.min && {
              difficulty: { $lte: filter.difficulty.max },
            }),
          ...(filter &&
            filter.difficulty &&
            filter.difficulty.max &&
            filter.difficulty.min && {
              difficulty: {
                $lte: filter.difficulty.max,
                $gte: filter.difficulty.min,
              },
            }),
        },
        { score: { $meta: "textScore" } }
      )
      .select(
        "_id, title , type , difficulty , totalTime , isVegetarian , isVegan , isLactoseFree , isGlutenFree , imagesUrls , totalTime "
      )
      .sort({ score: { $meta: "textScore" } });
    console.log(filter);
    let ids = [];
    products.forEach((element) => {
      ids.push(element._id);
    });
    let productsplus = [];

    try {
      let regex = `${req.query.keyword}`;
      productsplus = await recetteModel
        .find({
          title: { $regex: regex, $options: "i" },
          ...(filter &&
            filter.type &&
            filter.type.length !== 0 && {
              type: { $in: filter.type },
            }),
          ...(filter &&
            filter.isVegetarian && {
              isVegetarian: true,
            }),
          ...(filter &&
            filter.isVegan && {
              isVegan: true,
            }),
          ...(filter &&
            filter.isLactoseFree && {
              isLactoseFree: true,
            }),
          ...(filter &&
            filter.isGlutenFree && {
              isGlutenFree: true,
            }),
          ...(filter &&
            filter.duration &&
            filter.duration.min &&
            !filter.duration.max && {
              totalTime: { $gte: filter.duration.min },
            }),
          ...(filter &&
            filter.duration &&
            filter.duration.max &&
            !filter.duration.min && {
              totalTime: { $lte: filter.duration.min },
            }),
          ...(filter &&
            filter.duration &&
            filter.duration.max &&
            filter.duration.min && {
              totalTime: {
                $lte: filter.duration.max,
                $gte: filter.duration.min,
              },
            }),
          ...(filter &&
            filter.difficulty &&
            filter.difficulty.min &&
            !filter.difficulty.max && {
              difficulty: { $gte: filter.difficulty.min },
            }),
          ...(filter &&
            filter.difficulty &&
            filter.difficulty.max &&
            !filter.difficulty.min && {
              difficulty: { $lte: filter.difficulty.max },
            }),
          ...(filter &&
            filter.difficulty &&
            filter.difficulty.max &&
            filter.difficulty.min && {
              difficulty: {
                $lte: filter.difficulty.max,
                $gte: filter.difficulty.min,
              },
            }),
          _id: { $nin: ids },
        })
        .select(
          "_id, title , type , difficulty , totalTime , isVegetarian , isVegan , isLactoseFree , isGlutenFree , imagesUrls , totalTime "
        );
    } catch (err) {
      console.log(err);
      return next(new HttpError("Error Server", 500));
    }
    products.push(...productsplus);
    products.forEach((product) => {
      if (product.imagesUrls.length === 0) {
        product.imgUrls.push(
          "https://www.chezpatchouka.com/wp-content/uploads/2018/12/oups-oops.jpg"
        );
      }
    });
  } catch (err) {
    console.log(err);
    return next(new HttpError("Error Server", 500));
  }
  res.status(201).json({
    recettes: products.map((prod) => prod.toObject({ getters: true })),
  });
};

const searchByIngr = async (req, res, next) => {
  //Verify User Input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    let msg = "";
    errors.array().forEach((element) => {
      msg += JSON.stringify(element);
    });
    return next(new HttpError(msg, 422));
  }
  console.log(req.correctKewords);
  let listofIngr;
  try {
    listofIngr = await ingredientModel.find({ cookingTime: 1800 });
  } catch (err) {
    console.log(err);
    return next(new HttpError("Error Server", 500));
  }

  const listofRecette = await oskarFunction(listofIngr);
  res.status(201).json({
    recettes: listofRecette,
  });
};

const autocompleteIngr = async (req, res, next) => {
  //Verify UserInput
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Error input", 422));
  }

  let ingredients = [];
  try {
    ingredients = await ingredientModel
      .find(
        {
          $text: { $search: req.query.keyword },
        },
        { score: { $meta: "textScore" } }
      )
      .select("name")
      .sort({ score: { $meta: "textScore" } });
  } catch (err) {
    console.log(err);
    return next(new HttpError("Error Server", 500));
  }

  let ids = [];
  ingredients.forEach((ingr) => {
    ids.push(ingr._id);
  });

  let ingredientsplus = [];

  try {
    let regex = `${req.query.keyword}`;
    console.log(regex);
    ingredientsplus = await ingredientModel
      .find({
        name: { $regex: regex, $options: "i" },
        _id: { $nin: ids },
      })
      .select("name");
  } catch (err) {
    console.log(err);
    return next(new HttpError("Error Server", 500));
  }

  ingredients.push(...ingredientsplus);
  res.status(201).json({
    ingredient: ingredients.map((prod) => prod.toObject({ getters: true })),
  });
};

const autocompleteNameRecette = async (req, res, next) => {
  //Verify UserInput
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Error input", 422));
  }

  let recettes = [];
  try {
    recettes = await recetteModel
      .find(
        {
          $text: { $search: req.query.keyword },
        },
        { score: { $meta: "textScore" } }
      )
      .select("title")
      .sort({ score: { $meta: "textScore" } });
  } catch (err) {
    console.log(err);
    return next(new HttpError("Error Server", 500));
  }

  let recettesplus = [];

  let ids = [];
  recettes.forEach((rec) => {
    ids.push(rec._id);
  });
  try {
    let regex = `${req.query.keyword}`;
    console.log(regex);
    recettesplus = await recetteModel
      .find({
        title: { $regex: regex, $options: "i" },
        _id: { $nin: ids },
      })
      .select("title");
  } catch (err) {
    console.log(err);
    return next(new HttpError("Error Server", 500));
  }

  recettes.push(...recettesplus);
  res.status(201).json({
    recettes: recettes.map((prod) => prod.toObject({ getters: true })),
  });
};

/**
 * oskarFunction : Take a list of Ingr and return a list of Recette
 *
 * @param {*} listofOfIngr
 */
const oskarFunction = async (listofOfIngr) => {
  return [];
};

exports.searchByIngr = searchByIngr;
exports.getRecettebyId = getRecettebyId;
exports.searchByName = searchByName;
exports.autocompleteIngr = autocompleteIngr;
exports.autocompleteNameRecette = autocompleteNameRecette;
