const Mongoose = require("mongoose");
const HttpError = require("../Model/util/httpError");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const UserModel = require("../Model/userModel");

const signinFacebook = async (req, res, next) => {
  console.log("Call login");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Error input", 422));
  }
  const {userName, email, fbToken } = req.body;
  let existinguser;
  try {
    existinguser = await UserModel.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Logging failed, please try again later", 500);
    return next(error);
  }
  if (!existinguser) {
    existinguser=new UserModel({
      userName: userName,
      email: email,
      password: fbToken,
      sessions: [],
    });
  }
  const isValidPassword = fbToken===existinguser.fbToken;
  if (!isValidPassword) {
    try {
      const sess = await Mongoose.startSession();
      sess.startTransaction();
      await existinguser.save({ password:fbToken,session: sess });
      await sess.commitTransaction();
    } catch (err) {
      await sess.abortTransaction();
      console.log(err);
      const error = new HttpError(
        "siuffp up failed, please try again later",
        500
      );
      return next(error);
    }
  }
  //existinguser=await UserModel.findOne({ email: email });
  console.log("existinguser",existinguser);
  let token;
  try {
    token = jwt.sign(
      { userId: existinguser.id, email: existinguser.email },
      process.env.JWT_KEY,
      { expiresIn: "1y" }
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError("log up failed, please try again later", 500);
    return next(error);
  }

  res.status(201).json({
    userId: existinguser.id,
    email: existinguser.email,
    token: token,
    userName: existinguser.userName,
  });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Error input", 422));
  }

  let { userName, email, password } = req.body;
  console.log(req.body);
  let existinguser;
  try {
    existinguser = await UserModel.findOne({ email: email });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Ooops An error Occured", 500);
    return next(error);
  }

  if (existinguser) {
    const error = new HttpError(
      "Il existe un utilisateur avec cette email",
      422
    );
    return next(error);
  }

  let hashedpassword;

  try {
    hashedpassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("Couldf not create user please try again", 500);
    return next(error);
  }
  //creation du nouvel user
  // TODO: Save cart in DB
  const newUser = new UserModel({
    userName: userName,
    email: email,
    password: hashedpassword,
    sessions: [],
  });

  try {
    const sess = await Mongoose.startSession();
    sess.startTransaction();
    await newUser.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    await sess.abortTransaction();
    console.log(err);
    const error = new HttpError(
      "siuffp up failed, please try again later",
      500
    );
    return next(error);
  }

  try {
    token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_KEY,
      {
        expiresIn: "1y",
      }
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError("login up failed, please try again later", 500);
    return next(error);
  }
  res.status(201).json({
    userId: newUser.id,
    email: newUser.email,
    token: token,
    userName: newUser.userName,
  });
};

const login = async (req, res, next) => {
  console.log("Call login");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Error input", 422));
  }
  const { email, password } = req.body;
  let existinguser;
  try {
    existinguser = await UserModel.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Logging failed, please try again later", 500);
    return next(error);
  }
  if (!existinguser) {
    const error = new HttpError("Invalid email, could not find user", 401);
    return next(error);
  }
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existinguser.password);
  } catch {
    const error = new HttpError("Logging failed, please try again later", 500);
    return next(error);
  }
  if (!isValidPassword) {
    const error = new HttpError("Invalid credential", 403);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existinguser.id, email: existinguser.email },
      process.env.JWT_KEY,
      { expiresIn: "1y" }
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError("log up failed, please try again later", 500);
    return next(error);
  }

  res.status(201).json({
    userId: existinguser.id,
    email: existinguser.email,
    token: token,
    userName: existinguser.userName,
  });
};

exports.login = login;
exports.signup = signup;
exports.signinFacebook = signinFacebook;
