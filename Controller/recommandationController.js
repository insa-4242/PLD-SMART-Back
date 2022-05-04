const Mongoose = require("mongoose");
const HttpError = require("../Model/util/httpError");

const { validationResult } = require("express-validator");
const UserModel = require("../Model/userModel");
const recetteModel = require("../Model/recetteModel");
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
  let limitnumber = 4;
  try {
    limitnumber = parseInt(req.query.limitnumber);
    if (!limitnumber || limitnumber > 10 || limitnumber <= 0) limitnumber = 4;
  } catch (err) {
    limitnumber = 4;
  }

  try {
    recettes = await getGoodRecetteRandom(activeSession, limitnumber);
    //recettes = await getGoodRecette(activeSession);
  } catch (err) {
    return next(err);
  }

  //Si l'algo ne renvoie aucune recette cela signifie que la session is full
  //On recommence (création nouvelle session)
  if (recettes.length === 0) {
    await getreco(req, res, next);
  } else {
    //AddRecette to currentSession
    try {
      await addRecetteToSession(activeSession, recettes);
      //recettes = await getGoodRecette(activeSession);
    } catch (err) {
      return next(err);
    }

    res.status(201).json({ recettes: recettes });
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
  //start with the time field and calculate the mean of the liked recepies and the mean of the disliked recepies.
  activeSession.listOfRecRecettes[indexToChange] = {
    recette: activeSession.listOfRecRecettes[indexToChange].recette,
    like: req.body.type === "LIKE" ? true : false,
    status: "SEEN",
  };

  let updateteddRecetteID =
    activeSession.listOfRecRecettes[indexToChange].recette;
  const updatedrecette = await recetteModel.findById(updateteddRecetteID);
  activeSession = {
    liked: req.body.type === "LIKE" ? liked + 1 : liked,
    seenNotLiked: req.body.type !== "LIKE" ? seenNotLiked + 1 : seenNotLiked,
    vegeLPlus: updatedrecette.isVegetarian ? vegeLPlus + 1 : vegeLPlus,
    sweetLPlus: updatedrecette.isSweet ? sweetLPlus + 1 : sweetLPlus,
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

  /**  
 * user based or content based -> decided for contetnt based beacouse attirbutes of recepies are well defined and we dont have users
 * 

 */

  /**for the first intelligent recommendation algorithm i want tto take into account: time, type, sweetness
   * difficulty is also not evident and can't really be used( is impractical)
   * sweet [0;1] if >= 0.5 then the user preferes sweeter recepies
   *
   * time [0;30],[30;70];[70;150];[150;+]
   * we can calculate simply the median but this would be to much influenced by one 250 min recepie.
   * or we select the most liked categorie but recommend also recepies which have +- 15 min
   *
   * but I don't think the user will be as ratioanal to decide why the time, or maybe yes.
   * we could leave it out or if the dfference of cooking time between liked recepies and notliked recepies is big enough we count it in
   *
   * we have different types
   * accompagnement, amuse-geule, boisson, confisserie, dessert, entrée, plat rincipale, sauce
   * the difference between amuse-guele, accompagnement, entrée, plat principale is not evident
   * i will summarize confisserie, dessert into the type sweet_dish
   * i will summarize accompagnement, Amuse-guele and entrée
   * finally i will only cetegorize into boisson, sweet_dish, rest, and leave out sauce
   *
   *
   **/

  let random = Math.floor(Math.random() * limitNumber);

  for (let index = 0; index < session.listOfRecRecettes.length; index++) {
    const recette = session.listOfRecRecettes[index].recette;
    recettesIds.push(recette);
  }
  let recettes;
  //here we load a custom filter which is a result from our model. The filter will be updated on every response from the client, so in the post request
  try {
    recettes = await recetteModel
      .find({ _id: { $nin: recettesIds } })
      .limit(limitNumber)
      .skip(random)
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
const endSessionswithFull = async (fullSession) => {
  console.log("FUUUL SESSION");
  fullSession.isFull = true;
  const sess = await Mongoose.startSession();
  try {
    sess.startTransaction();
    await fullSession.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    await sess.abortTransaction();
    console.log(err);
    throw new HttpError("Server Errro", 500);
  }
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
    liked: 0,
    seenNotLiked: 0,
    vegeLPlus: 0,
    sweetLPlus: 0,
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
