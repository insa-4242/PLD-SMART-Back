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
  console.log(filter);
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
            filter.difficulty &&
            filter.difficulty.length !== 0 && {
              difficulty: { $in: filter.difficulty },
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
        },
        { score: { $meta: "textScore" } }
      )
      .select(
        "_id, title , type , difficulty , totalTime , isVegetarian , isVegan , isLactoseFree , isGlutenFree , imageUrls"
      )
      .sort({ score: { $meta: "textScore" } });

    products.forEach((product) => {
      if (product.imageUrls.length === 0) {
        product.imageUrls.push(
          "https://www.chezpatchouka.com/wp-content/uploads/2018/12/oups-oops.jpg"
        );
      }
    });
  } catch (err) {
    console.log(err);
    return next(new HttpError("Error Server", 500));
  }
  res.status(201).json({
    recette: products.map((prod) => prod.toObject({ getters: true })),
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
    console.log(ingredients);
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
 *  Function that build the good arrays needed in Mongo Query
 *
 * @param {*} filter The filter in Http Req
 * @returns {*} The good Query Array Filter stock in JS-Object
 */
const filterQueryBuilder = (filter) => {
  let filterqueryCat = [];
  filter &&
    filter.type &&
    filter.type.forEach((element) => {
      filterqueryCat.push({ categorie: element });
    });

  let filterquerySubCat1 = [];
  filter &&
    filter.subCategories1Id &&
    filter.subCategories1Id.forEach((element) => {
      filterquerySubCat1.push({ sub_categorie_1: element });
    });

  let filterquerySubCat2 = [];
  filter &&
    filter.subCategories2Id &&
    filter.subCategories2Id.forEach((element) => {
      filterquerySubCat2.push({ sub_categorie_2: element });
    });

  let filterquerySubCat3 = [];
  filter &&
    filter.subCategories3Id &&
    filter.subCategories3Id.forEach((element) => {
      filterquerySubCat3.push({ sub_categorie_3: element });
    });
  let filterqueryBrand = [];
  filter &&
    filter.brandId &&
    filter.brandId.forEach((element) => {
      filterqueryBrand.push({ brand: element });
    });

  return {
    filterqueryCat,
    filterquerySubCat1,
    filterquerySubCat2,
    filterquerySubCat3,
    filterqueryBrand,
  };
};

exports.getRecettebyId = getRecettebyId;
exports.searchByName = searchByName;
exports.autocompleteIngr = autocompleteIngr;
exports.autocompleteNameRecette = autocompleteNameRecette;
