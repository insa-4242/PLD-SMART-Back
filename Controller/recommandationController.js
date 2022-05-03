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

  //SelectRecettes to add
  let recettes;
  try {
    recettes = await getGoodRecetteRandom(activeSession);
    //recettes = await getGoodRecette(activeSession);
  } catch (err) {
    return next(err);
  }
  console.log(recettes);

  //AddRecette to currentSession
  try {
    await addRecetteToSession(activeSession, recettes);
    //recettes = await getGoodRecette(activeSession);
  } catch (err) {
    return next(err);
  }

  res.status(201).json({ recettes: recettes });
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
  const indexToChange = activeSession.listOfRecRecettes.findIndex((rec) => {
    return rec.recette.toString() === req.body.recetteId;
  });

  if (indexToChange === -1) return next(new HttpError("Bad Id", 403));

  activeSession.listOfRecRecettes[indexToChange] = {
    recette: activeSession.listOfRecRecettes[indexToChange].recette,
    like: req.body.type === "LIKE" ? true : false,
    status: "SEEN",
  };

  const sess = await Mongoose.startSession();
  try {
    sess.startTransaction();
    await activeSession.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    await sess.abortTransaction();
    return next(new HttpError("Error Server", 500));
  }

  res.status(201).json({ message: "ok" });
};
/**
 * Add the recette to the Session
 * @param {Session} sessionToChange
 * @param {Array[Recette]} recettes
 */
const addRecetteToSession = async (sessionToChange, recettes) => {
  let recetteToAdd = [];
  for (let index = 0; index < recettes.length; index++) {
    const recette = recettes[index];
    recetteToAdd.push({ recette: recette._id });
  }
  sessionToChange.listOfRecRecettes.push(...recetteToAdd);
  const sess = await Mongoose.startSession();
  try {
    sess.startTransaction();
    await sessionToChange.save({ session: sess });
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
};
/**
 * Get the recette randomness
 * @param {Session} session
 * @param {Array} limitNumber
 * @returns
 */
const getGoodRecetteRandom = async (session, limitNumber = 5) => {
  // Get All sessions
  let recettesIds = [];
  console.log(session);

  for (let index = 0; index < session.listOfRecRecettes.length; index++) {
    const recette = session.listOfRecRecettes[index].recette;
    recettesIds.push(recette);
  }
  let recettes;
  try {
    recettes = await recetteModel
      .find({ _id: { $nin: recettesIds } })
      .limit(limitNumber)
      .select(
        "_id, title , type , difficulty , totalTime , isVegetarian , isVegan , isLactoseFree , isGlutenFree , imagesUrls , totalTime "
      );
  } catch (err) {
    console.log(err);
    throw new HttpError("Error In servor", 500);
  }

  //if there is no recette we have getAll
  if (recettes.length === 0) {
    try {
      await endSessionswithFull(session);
    } catch (err) {
      console.log(err);
      throw new HttpError("Error In servor", 500);
    }
  }
  return recettes;
};
/**
 * TODO
 * @param {*} session
 */
const endSessionswithFull = async (session) => {
  console.log("TODOENDSESS");
};
/**
 * Create a sessions for an user ID
 * @param {String} userId
 * @returns
 */
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
  const sess = await Mongoose.startSession();
  try {
    sess.startTransaction();
    await user.save({ session: sess });
    await newUserSession.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    await sess.abortTransaction();
    console.log(err);
    throw new HttpError("Critical Error Send mail", 500);
  }
  return newUserSession;
};
/**
 * Find the good sessions of user (create if doesnt exit)
 * @param {Array[Sessions]} sessions
 * @param {String} userId
 * @returns
 */
const findGoodSessions = async (sessions, userId) => {
  let goodSession = null;
  for (let index = 0; index < sessions.length; index++) {
    const sess = sessions[index];
    if (lessThanOneHourAgo(sess.date) && !sess.isFull) {
      goodSession = sess;
      break;
    }
  }

  // Add sessions if not exist
  if (!goodSession) {
    try {
      goodSession = await createSession(userId);
    } catch (err) {
      throw new HttpError("Error In server", 500);
    }
  }
  return goodSession;
};
/**
 * Check if a date is less than 1H Ago
 * @param {Date} date
 * @returns Boolean
 */
const lessThanOneHourAgo = (date) => {
  const HOUR = 1000 * 60 * 60;
  const anHourAgo = Date.now() - HOUR;

  return date > anHourAgo;
};
exports.getreco = getreco;
exports.postreco = postreco;
