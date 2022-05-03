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
  console.log(req);
  //find session of user
  user = null;
  try {
    user = await userModel.findById(req.userData.userId).populate({
      path: "sessions",
      populate: {
        path: "sessionID",
      },
    });
    console.log(user);
  } catch {
    //no user with this ID found in the database
  }
  if (user.sessions.length == 0) {
    const newUserSession = new sessionModel({
      userId: user._id,
      listOfRecRecettes: [],
      date: Date.now(),
    });
    console.log(newUserSession);
    //mongoose needs to create an id before i can stock it in the session array
    user.sessions.unshift(newUserSession._id);
    try {
      await newUserSession.save();
      await user.save();
    } catch (err) {
      console.log(err);
      const error = new HttpError("Error saving Catégorie", 500);
      return next(error);
    }
  } //is there an active session active means the session on top of the list is not older then 1h
  else if (user.sessions[0].date)
    //if doesnot exist or timed out-> create new session
    //get 4 random recepies, stack them into session
    //FAKE DATA
    try {
      products = await recetteModel
        .findById("625bdac6916c1071b45e77f3")
        .select(
          "_id, title , type , difficulty , totalTime , isVegetarian , isVegan , isLactoseFree , isGlutenFree , imagesUrls , totalTime "
        );
    } catch (err) {}

  res.status(201).json({ Recettes: [products, products, products, products] });
};

const postreco = async (req, res, next) => {
  res.status(201).json("uu");
};

exports.getreco = getreco;
exports.postreco = postreco;
