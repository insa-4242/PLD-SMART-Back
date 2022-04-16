const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const HttpError = require("./Model/util/httpError");

const routerRecette = require("./Routes/recetteRoutes");
const routerMobile = require("./Routes/mobileRoutes");

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();

//Parse the Request... Cool for manipulating Buffer
app.use(bodyParser.json());

//Allow Access And Request Type from Anywhere
app.use((req, res, next) => {
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
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LaGraillance®",
      version: "0.1.0",
      description: "Official documentation of LaGraillance® API",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Louis LOMBARD",
        url: "https://saucis.se",
      },
    },
    servers: [
      {
        url: "https://graillance.herokuapp.com/",
      },
    ],
  },
  apis: ["./Routes/*.js"],
};

const specs = swaggerJsdoc(options);
/* app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
); */
//Defines Routes
app.use("/api/recette", routerRecette);
app.use("/api/mobile", routerMobile);

//Créer une erreur si la requete n'est pas traitée
app.use((req, res, next) => {
  const error = new HttpError("Could note find this route", 404);
  throw error;
});

// Gérer les erreur
app.use((error, req, res, next) => {
  if (req.method === "OPTIONS") {
    console.log("A preflight request has been sent");
    return res.status(200).end();
  }
  console.log(error.message);
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknow error appears" });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@recettes.mwcji.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("conneted");
    app.listen(process.env.PORT || 8080);
  })
  .catch((err) => {
    console.log(err);
  });
