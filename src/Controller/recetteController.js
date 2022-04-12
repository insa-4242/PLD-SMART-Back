import recetteModel from "../Model/recetteModel";

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
    instruction: "TEST",
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

exports.getRecette = getRecette;
exports.postRecette = postRecette;
