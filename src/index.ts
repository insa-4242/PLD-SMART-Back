import express, {
  Express,
  Request,
  Response,
  ErrorRequestHandler,
} from "express";
import { connect as mongooseConnect } from "mongoose";

import bodyParser from "body-parser";

import HttpError from "./Model/util/httpError";

import routerRecette from "./Routes/recetteRoutes";

const app: Express = express();

//Parse the Request... Cool for manipulating Buffer
app.use(bodyParser.json());

//Allow Access And Request Type from Anywhere
app.use((req: Request, res: Response, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  next();
});

//Defines Routes
app.use("/api/recette", routerRecette);

//Créer une erreur si la requete n'est pas traitée
app.use((req, res, next) => {
  const error = new HttpError("Could note find this route", 404);
  throw error;
});

// Gérer les erreur
const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (req.method === "OPTIONS") {
    console.log("A preflight request has been sent");
    return res.status(200).end();
  }
  console.log(error.message);
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknow error appears" });
};
app.use(errorHandler);

mongooseConnect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@recettes.mwcji.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
)
  .then(() => {
    console.log("conneted");
    app.listen(process.env.PORT || 8080);
  })
  .catch((err) => {
    console.log(err);
  });
