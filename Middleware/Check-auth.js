const HttpError = require("../Model/util/httpError");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  console.log("Call check Auth");
  if (req.method === "OPTIONS") {
    next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("Auth Failed");
    }
    const decodedtoken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { userId: decodedtoken.userId };
    next();
  } catch (err) {
    const error = new HttpError("Authorzatieeeon failed", 403);
    return next(error);
  }
};
