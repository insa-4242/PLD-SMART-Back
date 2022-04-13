import recetteModel from "../Model/recetteModel";
import HttpError from "../Model/util/httpError";

const postIngredient = async (req, res, next) => {
  const newIngredient = new ingredientModel({
    marmitonID: "test",
  });

  try {
    await newIngredient.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Error saving Categorie", 500);
    return next(error);
  }
  res.status(201).json({
    status: "ok",
  });
};

exports.postIngredient = postIngredient;
