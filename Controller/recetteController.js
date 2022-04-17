const Mongoose = require("mongoose");

const recetteModel = require("../Model/recetteModel");
const ingredientModel = require("../Model/ingredientModel");
const utensilModel = require("../Model/utensilModel");
const HttpError = require("../Model/util/httpError");

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
  console.log(req.body);
  const newRecette = new recetteModel({
    marmitonUrl: req.body.marmitonUrl,
    marmitonId: req.body.marmitonId,
    imagesUrls: req.body.imagesUrls,
    categories: req.body.categories,
    title: req.body.name,
    preparationTime: req.body.prepTime,
    cookingTime: req.body.cookingTime,
    restTime: req.body.restTime,
    totalTime: req.body.totalTime,
    rating: req.body.rating,
    ratingCount: req.body.ratingCount,
    cost: req.body.cost,
    difficulty: req.body.difficulty,
    preferredNumberIngr: req.body.preferredNumberIngr,
    instructions: req.body.steps,
    author: req.body.author,
    cookTime: req.body.cookTime,
    totalTime: req.body.totalTime,
    ingredients: [],
    utensiles: [],
    author: req.body.author,
    type: req.body.type,
    nutriScore: req.body.nutriScore,
    ecoScore: req.body.ecoScore,
    isSeasonal: req.body.isSeasonal,
    isGlutenFree: req.body.isGlutenFree,
    isLactoseFree: req.body.isLactoseFree,
    isVegetarian: req.body.isVegetarian,
    isVegan: req.body.isVegan,
    isPorkFree: req.body.isPorkFree,
    isSweet: req.body.isSweet,
    isSalty: req.body.isSalty,
  });

  let newIngredients = [];
  let ingredientsfinalArray = [];

  for (let index = 0; index < req.body.ingredients.length; index++) {
    const ingredient = req.body.ingredients[index];
    let existingIngredient;
    try {
      existingIngredient = await ingredientModel.findOne({
        marmitonId: ingredient.marmitonId,
      });
      if (!existingIngredient) {
        const newIngredient = new ingredientModel({
          name: ingredient.name,
          imgUrl: ingredient.imageUrl,
          marmitonId: ingredient.marmitonId,
          idsRecette: [newRecette._id],
        });
        newIngredients.push(newIngredient);
        ingredientsfinalArray.push({
          idIngredient: newIngredient._id,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
        });
      } else {
        newIngredients.push(existingIngredient);
        existingIngredient.idsRecette.push(newRecette._id);
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
  let newUtensils = [];
  let utensilsFinalArray = [];
  for (let index = 0; index < req.body.utensils.length; index++) {
    const utensil = req.body.utensils[index];
    let existingUtensil;
    try {
      existingUtensil = await utensilModel.findOne({
        marmitonId: utensil.marmitonId,
      });
      if (!existingUtensil) {
        const newUtensil = new utensilModel({
          name: utensil.name,
          imgUrl: utensil.imageUrl,
          marmitonId: utensil.marmitonId,
          idsRecette: [newRecette._id],
        });
        newUtensils.push(newUtensil);
        utensilsFinalArray.push({
          idUtensil: newUtensil._id,
          quantity: utensil.quantity,
        });
      } else {
        newUtensils.push(existingUtensil);
        existingUtensil.idsRecette.push(newRecette._id);
        utensilsFinalArray.push({
          idUtensil: existingUtensil._id,
          quantity: utensil.quantity,
        });
      }
    } catch (err) {
      console.log(err);
      const error = new HttpError("Ooops An error Occured", 500);
      return next(error);
    }
  }
  console.log(utensilsFinalArray);
  newRecette.ingredients = ingredientsfinalArray;
  newRecette.utensils = utensilsFinalArray;
  const sess = await Mongoose.startSession();
  try {
    sess.startTransaction();
    for (let index = 0; index < newIngredients.length; index++) {
      await newIngredients[index].save({ session: sess });
    }
    for (let index = 0; index < newUtensils.length; index++) {
      await newUtensils[index].save({ session: sess });
    }
    await newRecette.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    await sess.abortTransaction();
    console.log(err);
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
