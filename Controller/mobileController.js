const Mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const recetteModel = require("../Model/recetteModel");
const ingredientModel = require("../Model/ingredientModel");
const HttpError = require("../Model/util/httpError");
const algo = require("../Model/util/algo.js");

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
            filter.difficulty && {
              difficulty: { $in: filter.difficulty },
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
              totalTime: { $lte: filter.duration.max },
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
            filter.difficulty && {
              difficulty: { $in: filter.difficulty },
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
  console.log(products);
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

  //Step1: create a listoflist who is gonna contains all the infos for each keywords
  let listOflistOfRecette = [];
  for (let index = 0; index < req.correctKewords.length; index++) {
    const keyword = req.correctKewords[index];

    // Let's try to get all the ingredient connected to ONE User keyword
    let ingredientIndex = [];
    try {
      ingredientIndex = await ingredientModel
        .find(
          {
            $text: { $search: keyword },
          },
          { score: { $meta: "textScore" } }
        )
        .sort({ score: { $meta: "textScore" } });
    } catch (err) {
      return next(new HttpError("Error Server", 500));
    }

    // Now we want to have the list of recette connected to all ingredients founded with ONE user keyword
    let listOfIdsRecetteIndex = [];
    ingredientIndex.forEach((element) => {
      listOfIdsRecetteIndex = listOfIdsRecetteIndex.concat(
        element.idsRecette.map((el) => el.toString())
      );
    });

    //Remove dupplication without regarding the number of occurence
    //Because we dont'care if there is multiple instance of ONE unique keyword in the final recipe
    const ListUniqueIdsRecetteIndex = [...new Set(listOfIdsRecetteIndex)];

    //Push the list in our listofIngr
    listOflistOfRecette.push(ListUniqueIdsRecetteIndex);
  }

  // We are know looking for interseption of our listOflistOfRecette which is a list of Recette
  // which are all in the ListUniqueIdsRecetteIndex for each keywords
  let interseptArray = listOflistOfRecette[0];
  for (let index = 0; index < listOflistOfRecette.length; index++) {
    interseptArray = interseptArray.filter((value) =>
      listOflistOfRecette[index].includes(value)
    );
  }
  // Here if you want you can better our solution by not only recup interseption
  // But also recipe wiche are in ALMOST every array but not all

  //Let's find the recipe by id in DB
  let filter = req.query.correctFilter;
  let foundRecepies = [];
  try {
    foundRecepies = await recetteModel
      .find({
        _id: { $in: interseptArray },
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
            totalTime: { $lte: filter.duration.max },
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
          filter.difficulty && {
            difficulty: { $in: filter.difficulty },
          }),
      })
      .select(
        "_id, title , type , difficulty , totalTime , isVegetarian , isVegan , isLactoseFree , isGlutenFree , imagesUrls , totalTime "
      );
  } catch (err) {
    console.log(err);
    return next(new HttpError("SERVER ERROR", 500));
  }
  console.log("possible Recepies: ", foundRecepies);
  res.status(201).json({
    recettes: foundRecepies.map((prod) => prod.toObject({ getters: true })),
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
      .limit(3)
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
      .limit(3)
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
      .limit(3)
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
      .limit(3)
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

const initRecette = async (req, res, next) => {
  let existingRecette;
  const filter = req.query.correctFilter;
  try {
    existingRecette = await recetteModel
      .find({
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
            totalTime: { $lte: filter.duration.max },
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
          filter.difficulty && {
            difficulty: { $in: filter.difficulty },
          }),
      })
      .limit(50)
      .select(
        "_id, title , type , difficulty , totalTime , isVegetarian , isVegan , isLactoseFree , isGlutenFree , imagesUrls , totalTime "
      );
  } catch (err) {
    console.log(err);
    const error = new HttpError("Ooops An error Occured", 500);
    return next(error);
  }

  res.status(201).json({
    recettes: existingRecette.map((rec) => rec.toObject({ getters: true })),
  });
};
exports.initRecette = initRecette;
exports.searchByIngr = searchByIngr;
exports.getRecettebyId = getRecettebyId;
exports.searchByName = searchByName;
exports.autocompleteIngr = autocompleteIngr;
exports.autocompleteNameRecette = autocompleteNameRecette;
