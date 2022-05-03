const Mongoose = require("mongoose");
const HttpError = require("../Model/util/httpError");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const UserModel = require("../Model/userModel");
const recetteModel = require("../Model/recetteModel");
const userModel = require("../Model/userModel");
const sessionModel = require("../Model/sessionModel");

const getreco = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Error input", 422));
  }

  // Get all sessions
  let allUserSessions;
  try {
    allUserSessions = await sessionModel.find({ userId: req.userData.userId });
  } catch (err) {
    console.log(err);
    return next(new HttpError("Error In token", 422));
  }

  //find goodSessions
  let activeSession;
  try {
    activeSession = await findGoodSessions(
      allUserSessions,
      req.userData.userId
    );
  } catch (err) {
    return next(err);
  }
  console.log(activeSession);

  let recettes;
  try {
    recettes = await getGoodRecetteRandom(activeSession);
    //recettes = await getGoodRecette(activeSession);
  } catch (err) {
    return next(err);
  }

  try {
    products = await recetteModel
      .findById("6270d92b2f97557775cad60b")
      .select(
        "_id, title , type , difficulty , totalTime , isVegetarian , isVegan , isLactoseFree , isGlutenFree , imagesUrls , totalTime "
      );
  } catch (err) {}

  res.status(201).json({ Recettes: [products, products, products, products] });
};
const getGoodRecetteRandom = async (session) => {
  // Get All sessions
  let allUserSessions;
  try {
    allUserSessions = await recetteModel.find({ _id: req.userData.userId });
  } catch (err) {
    console.log(err);
    return next(new HttpError("Error In token", 422));
  }
};
const postreco = async (req, res, next) => {
  //Check userInput
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Error input", 422));
  }

  // Get All sessions
  let allUserSessions;
  try {
    allUserSessions = await sessionModel.find({ userId: req.userData.userId });
  } catch (err) {
    console.log(err);
    return next(new HttpError("Error In token", 422));
  }
  if (sessions.length === 0) {
    console.log(err);
    return next(new HttpError("Error in sessions", 422));
  }
  // Find good session
  let activeSession;
  try {
    activeSession = await findGoodSessions(
      allUserSessions,
      req.userData.userId
    );
  } catch (err) {
    return next(err);
  }

  console.log(activeSession);

  res.status(201).json("uu");
};

const createSession = async (userId) => {
  const newUserSession = new sessionModel({
    userId: userId,
    listOfRecRecettes: [],
    date: Date.now(),
  });

  //Modify user
  let user;
  try {
    user = await UserModel.findById(userId);
  } catch (err) {
    throw new HttpError("Error In server", 500);
  }
  if (!user) {
    throw new HttpError("Critical Erro Send mail", 500);
  }
  user.sessions.push(newUserSession._id);

  //save all
  try {
    const sess = await Mongoose.startSession();
    sess.startTransaction();
    await user.save({ session: sess });
    await newUserSession.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    await sess.abortTransaction();
    console.log(err);
    const error = new HttpError(
      "siuffp up failed, please try again later",
      500
    );
    throw new HttpError("Critical Error Send mail", 500);
  }
  return newUserSession;
};
const findGoodSessions = async (sessions, userId) => {
  let goodSession = null;
  for (let index = 0; index < sessions.length; index++) {
    const sess = sessions[index];
    if (lessThanOneHourAgo(sess.date)) {
      goodSession = sess;
      break;
    }
  }

  // Add sessions if not exist
  if (!goodSession) {
    try {
      await createSession(userId);
    } catch (err) {
      throw new HttpError("Error In server", 500);
    }
  }
  return goodSession;
};

const lessThanOneHourAgo = (date) => {
  const HOUR = 1000 * 60 * 60;
  const anHourAgo = Date.now() - HOUR;

  return date > anHourAgo;
};
exports.getreco = getreco;
exports.postreco = postreco;
