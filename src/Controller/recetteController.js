const Mongoose = require("mongoose");

import recetteModel from "../Model/recetteModel";
import ingredientModel from "../Model/ingredientModel";

import HttpError from "../Model/util/httpError";

const getRecette = async (req, res, next) => {
  let existingRecette;
  try {
    existingRecette = await recetteModel.find({});
  } catch (err) {
    console.log(err);
    const error = new HttpError("Ooops An error Occured", 500);
    return next(error);
  }
  if (!existingRecette) {
    const error = new HttpError("Don't have the right MF", 403);
    return next(error);
  }
  console.log(existingRecette);

  res.status(201).json({
    recette: existingRecette.map((elem) => elem.toObject({ getters: true })),
  });
};

const postRecette = async (req, res, next) => {
  //TODO --> Vérify INput Error --> Check moogoose validators
  //Todo remplace "TEST" byInput
  const newRecette = new recetteModel({
    marmitonID: "test",
    imageUrl: "testurl",
    title: "testtile",
    subtitle: "",
    duration: 14,
    difficulty: "facile",
    isVegetarian: true,
    isVegan: false,
    isLactoseFree: false,
    isGlutenFree: false,
    instructions: ["first", "second"],
    ingredients: [],
    utensiles: [],
  });

  try {
    await newRecette.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Error saving Catégorie", 500);
    return next(error);
  }
  res.status(201).json({
    status: "ok",
  });
};

const addRec = async (req, res, next) => {
  //TODO --> Vérify INput Error --> Check moogoose validators

  let newIngredients = [];
  let ingredientsfinalArray = [];
  for (let index = 0; index < req.body.ingredients.length; index++) {
    const ingredient = req.body.ingredients[index];
    let existingIngredient;
    try {
      existingIngredient = await ingredientModel.findOne({
        name: ingredient.name,
      });
      if (!existingIngredient) {
        const newIngredient = new ingredientModel({
          name: ingredient.name,
          imageUrl: ingredient.imageUrl,
        });
        newIngredients.push(newIngredient);
        ingredientsfinalArray.push({
          idIngredient: newIngredient._id,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
        });
      } else {
        ingredientsfinalArray.push({
          idIngredient: existingIngredient._id,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
        });
      }
    } catch (err) {
      console.log(err);
      const error = new HttpError("Ooops An error Occured", 500);
      return next(error);
    }
  }

  console.log(req.body.images);

  const newRecette = new recetteModel({
    marmitonUrl: req.body.url,
    imageUrls: req.body.images,
    title: req.body.name,
    category: req.body.recipeCategory,
    datePublished: req.body.datePublished,
    prepTime: req.body.prepTime,
    cookTime: req.body.cookTime,
    totalTime: req.body.totalTime,
    difficulty: "facile",
    isVegetarian: false,
    isVegan: false,
    isLactoseFree: false,
    isGlutenFree: false,
    instructions: req.body.step,
    author: req.body.author,
    cookTime: req.body.cookTime,
    totalTime: req.body.totalTime,
    ingredients: ingredientsfinalArray,
    utensiles: [],
    author: req.body.author,
    description: req.body.description,
    keywords: req.body.keywords,
    type: req.body.type,
    note: req.body.note,
  });
  console.log(newRecette);

  try {
    const sess = await Mongoose.startSession();
    sess.startTransaction();
    for (let index = 0; index < newIngredients.length; index++) {
      await newIngredients[index].save({ session: sess });
    }
    await newRecette.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log("runTransactionWithRetry error: ");
    const error = new HttpError("Error saving Catégorie", 500);
    return next(error);
  }
  res.status(201).json({
    status: "ok",
  });
};

exports.getRecette = getRecette;
exports.postRecette = postRecette;
exports.addRec = addRec;
