const express = require("express");
const routerMobile = express.Router();
const mobileController = require("../Controller/mobileController");
const userController = require("../Controller/userController");
const recoController = require("../Controller/recommandationController");
const checkAuth = require("../Middleware/Check-auth");
const { check } = require("express-validator");
const mongoose = require("mongoose");

function isNumerica(str) {
  if (typeof str === "boolean") return false;
  if (typeof str === "number") return true;
  if (typeof str === "string") {
    return (
      !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      !isNaN(parseFloat(str))
    ); // ...and ensure strings of whitespace fail
  }
}
/**
 * @swagger
 * tags:
 *  name: Mobile - Home
 *  description: HomePage of Flutter App
 *
 */
/**
 * @swagger
 *  /api/mobile/recette/{id}:
 *    get:
 *      summary: Returns all infos on recipe
 *      tags: [Mobile - Home]
 *      description: Get all info on a recipe
 *      parameters:
 *        - name: id
 *          in: path
 *          example: 6259d4e7e2dc91c928c3a147
 *          required: true
 *          schema:
 *            type: string
 *          description: The id
 *      responses:
 *        '201':
 *          description: A Sucess
 *          content:
 *            application/json:
 *                type: object
 *        '500':
 *         description: Serveur Error
 *        '402':
 *         description: Error Input
 *
 * /api/mobile/namesearch:
 *    get:
 *      summary: Returns a list of recette based on recipe name.
 *      tags: [Mobile - Home]
 *      description: Get a list of Recette With Keyword
 *      parameters:
 *        - name: keyword
 *          in: query
 *          example: chocolat
 *          required: true
 *          schema:
 *            type: string
 *          description: The query input
 *        - name: filter
 *          style: form
 *          required: false
 *          explode: true
 *          description: The filters available
 *          in: query
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Filter'
 *      responses:
 *        '201':
 *          description: A Sucess
 *          content:
 *            application/json:
 *                type: object
 *        '500':
 *         description: Serveur Error
 *        '402':
 *         description: Error Input
 *
 * /api/mobile/ingredientSearch:
 *    get:
 *      summary: Returns a list of recette based on ingredients.
 *      tags: [Mobile - Home]
 *      description: Get a list of Recette With Keywords
 *      parameters:
 *        - name: keywords
 *          in: query
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  type: string
 *                  example: "Dessert"
 *                example: ["chocolat", "farine"]
 *          description: The query input
 *        - name: filter
 *          style: form
 *          required: false
 *          explode: true
 *          description: The filters available
 *          in: query
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Filter'
 *      responses:
 *        '201':
 *          description: A Sucess
 *          content:
 *            application/json:
 *                type: object
 *        '500':
 *         description: Serveur Error
 *        '402':
 *         description: Error Input
 *
 * /api/mobile/autocomplete/recetteName:
 *    get:
 *      summary: Returns a list of recette's name based on user input.
 *      tags: [Mobile - Home]
 *      description: Get a list of Recette With Keywords
 *      parameters:
 *        - name: keyword
 *          in: query
 *          required: true
 *          type: string
 *          description: The query input
 *          example: tart
 *      responses:
 *        '201':
 *          description: A Sucess
 *          content:
 *            application/json:
 *                type: object
 *        '500':
 *         description: Serveur Error
 *        '402':
 *         description: Error Input
 *
 * /api/mobile/autocomplete/ingredient:
 *    get:
 *      summary: Returns a list of ingredient's name based on user input.
 *      tags: [Mobile - Home]
 *      description: Get a list of Recette With Keywords
 *      parameters:
 *        - name: keyword
 *          in: query
 *          required: true
 *          type: string
 *          description: The query input
 *          example: chocol
 *      responses:
 *        '201':
 *          description: A Sucess
 *          content:
 *            application/json:
 *                type: object
 *        '500':
 *         description: Serveur Error
 *        '402':
 *         description: Error Input
 * components:
 *  schemas:
 *    Filter:
 *      type: object
 *      properties:
 *        regime:
 *          type: array
 *          items:
 *            type: string
 *            enum:
 *              - gluttenfree
 *              - lactosefree
 *              - vegan
 *              - vegetarian
 *            example: "vegetarian"
 *        type:
 *          type: array
 *          items:
 *            type: string
 *          example: ["Dessert"]
 *        duration:
 *          type: object
 *          properties:
 *            min:
 *              type: integer
 *              format: int64
 *            max:
 *              type: integer
 *              format: int64
 *              example: 15000
 *        difficulty:
 *          type: object
 *          properties:
 *            min:
 *              type: integer
 *              format: int64
 *            max:
 *              type: integer
 *              format: int64
 *              example: 5
 */
routerMobile.get(
  "/namesearch",
  [
    check("keyword").not().isEmpty(),
    check("keyword").isString(),
    check("filter")
      .optional()
      .custom((value, { req }) => {
        let filter;
        try {
          filter = JSON.parse(value);
        } catch (err) {
          console.log(err);
          throw new Error("Not a good Json file in filter");
        }
        if (filter.duration) {
          if (filter.duration.min) {
            try {
              if (isNumerica(filter.duration.min)) {
                if (typeof filter.duration.min === "string") {
                  filter.duration.min = parseInt(filter.duration.min);
                }
              } else {
                throw new Error("duration minimum must be an int");
              }
            } catch (err) {
              throw new Error("duration minimum must be an int");
            }
          }
          if (filter.duration.max) {
            try {
              if (isNumerica(filter.duration.max)) {
                if (typeof filter.duration.max === "string") {
                  filter.duration.max = parseInt(filter.duration.max);
                }
              } else {
                throw new Error("duration maximum must be an int");
              }
            } catch (err) {
              throw new Error("duration maximum must be an int");
            }
          }
        }
        if (filter.type) {
          try {
            filter.type.forEach((typ) => {
              if (typeof typ !== "string") {
                throw new Error("filter.type must be an array of string");
              }
            });
          } catch (err) {
            throw new Error("filter.type must be an array of string");
          }
        }
        if (filter.regime) {
          try {
            let isVegetarian;
            let isVegan;
            let isLactoseFree;
            let isGlutenFree;
            filter.regime.forEach((typ) => {
              if (typeof typ !== "string") {
                throw new Error(
                  "filter.regime must be an array of 'gluttenfree','vegetarian','vegan','lactosefree'"
                );
              } else {
                switch (typ) {
                  case "gluttenfree":
                    isGlutenFree = true;
                    break;
                  case "vegan":
                    isVegan = true;
                    break;
                  case "lactosefree":
                    isLactoseFree = true;
                    break;
                  case "vegetarian":
                    isVegetarian = true;
                    break;
                  default:
                    throw new Error(
                      "filter.regime must be an array of 'gluttenfree','vegetarian','vegan','lactosefree'"
                    );
                    break;
                }
              }
            });
            filter.isVegetarian = isVegetarian;
            filter.isLactoseFree = isLactoseFree;
            filter.isVegan = isVegan;
            filter.isGlutenFree = isGlutenFree;
          } catch (err) {
            console.log(err);
            throw new Error(
              "filter.regime must be an array of 'gluttenfree','vegetarian','vegan','lactosefree'"
            );
          }
        }
        if (filter.difficulty) {
          try {
            filter.difficulty.forEach((dif, index) => {
              if (isNumerica(dif)) {
                if (typeof filter.difficulty.min === "string") {
                  filter.difficulty[index] = parseInt(dif);
                }
              } else {
                throw new Error(
                  "difficulty minimum must be an int  between 0 and 1"
                );
              }
              if (dif < 1 || dif > 5) {
                throw new Error(
                  "difficulty minimum must be an int  between 0 and 1"
                );
              }
            });
          } catch (err) {
            throw new Error(
              "difficulty minimum must be an array of int between 0 and 1"
            );
          }
        }
        req.query.correctFilter = filter;
        return true;
      }),
  ],
  mobileController.searchByName
);
routerMobile.get(
  "/autocomplete/ingredient",
  [check("keyword").not().isEmpty(), check("keyword").isString()],
  mobileController.autocompleteIngr
);
routerMobile.get(
  "/autocomplete/recetteName",
  [check("keyword").not().isEmpty(), check("keyword").isString()],
  mobileController.autocompleteNameRecette
);
routerMobile.get(
  "/ingredientSearch",
  [
    check("keywords").not().isEmpty(),
    check("keywords").custom((value, { req }) => {
      let arrayKeywords;
      try {
        arrayKeywords = JSON.parse(value);
      } catch (err) {
        console.log(err);
        throw new Error("Not a good Array in keywords");
      }
      console.log(arrayKeywords);
      arrayKeywords.forEach((keyword) => {
        if (typeof keyword !== "string") {
          console.log("ezfezfeze");
          throw new Error("Not a good Array of string in keywords");
        }
      });
      req.correctKewords = arrayKeywords;
      return true;
    }),
    check("filter")
      .optional()
      .custom((value, { req }) => {
        let filter;
        try {
          filter = JSON.parse(value);
        } catch (err) {
          console.log(err);
          throw new Error("Not a good Json file in filter");
        }
        if (filter.duration) {
          if (filter.duration.min) {
            try {
              if (isNumerica(filter.duration.min)) {
                if (typeof filter.duration.min === "string") {
                  filter.duration.min = parseInt(filter.duration.min);
                }
              } else {
                throw new Error("duration minimum must be an int");
              }
            } catch (err) {
              throw new Error("duration minimum must be an int");
            }
          }
          if (filter.duration.max) {
            try {
              if (isNumerica(filter.duration.max)) {
                if (typeof filter.duration.max === "string") {
                  filter.duration.max = parseInt(filter.duration.max);
                }
              } else {
                throw new Error("duration maximum must be an int");
              }
            } catch (err) {
              throw new Error("duration maximum must be an int");
            }
          }
        }
        if (filter.difficulty) {
          try {
            filter.difficulty.forEach((dif, index) => {
              if (isNumerica(dif)) {
                if (typeof filter.difficulty.min === "string") {
                  filter.difficulty[index] = parseInt(dif);
                }
              } else {
                throw new Error(
                  "difficulty minimum must be an int  between 0 and 1"
                );
              }
              if (dif < 1 || dif > 5) {
                throw new Error(
                  "difficulty minimum must be an int  between 0 and 1"
                );
              }
            });
          } catch (err) {
            throw new Error(
              "difficulty minimum must be an array of int between 0 and 1"
            );
          }
        }
        if (filter.type) {
          try {
            filter.type.forEach((typ) => {
              if (typeof typ !== "string") {
                throw new Error("filter.type must be an array of string");
              }
            });
          } catch (err) {
            throw new Error("filter.type must be an array of string");
          }
        }
        if (filter.regime) {
          try {
            let isVegetarian;
            let isVegan;
            let isLactoseFree;
            let isGlutenFree;
            filter.regime.forEach((typ) => {
              if (typeof typ !== "string") {
                throw new Error(
                  "filter.regime must be an array of 'gluttenfree','vegetarian','vegan','lactosefree'"
                );
              } else {
                switch (typ) {
                  case "gluttenfree":
                    isGlutenFree = true;
                    break;
                  case "vegan":
                    isVegan = true;
                    break;
                  case "lactosefree":
                    isLactoseFree = true;
                    break;
                  case "vegetarian":
                    isVegetarian = true;
                    break;
                  default:
                    throw new Error(
                      "filter.regime must be an array of 'gluttenfree','vegetarian','vegan','lactosefree'"
                    );
                    break;
                }
              }
            });
            filter.isVegetarian = isVegetarian;
            filter.isLactoseFree = isLactoseFree;
            filter.isVegan = isVegan;
            filter.isGlutenFree = isGlutenFree;
          } catch (err) {
            console.log(err);
            throw new Error(
              "filter.regime must be an array of 'gluttenfree','vegetarian','vegan','lactosefree'"
            );
          }
        }

        req.query.correctFilter = filter;
        return true;
      }),
  ],
  mobileController.searchByIngr
);
routerMobile.get(
  "/recette/init",
  [
    check("filter")
      .optional()
      .custom((value, { req }) => {
        let filter;
        try {
          filter = JSON.parse(value);
        } catch (err) {
          console.log(err);
          throw new Error("Not a good Json file in filter");
        }
        if (filter.duration) {
          if (filter.duration.min) {
            try {
              if (isNumerica(filter.duration.min)) {
                if (typeof filter.duration.min === "string") {
                  filter.duration.min = parseInt(filter.duration.min);
                }
              } else {
                throw new Error("duration minimum must be an int");
              }
            } catch (err) {
              throw new Error("duration minimum must be an int");
            }
          }
          if (filter.duration.max) {
            try {
              if (isNumerica(filter.duration.max)) {
                if (typeof filter.duration.max === "string") {
                  filter.duration.max = parseInt(filter.duration.max);
                }
              } else {
                throw new Error("duration maximum must be an int");
              }
            } catch (err) {
              throw new Error("duration maximum must be an int");
            }
          }
        }
        if (filter.difficulty) {
          try {
            filter.difficulty.forEach((dif, index) => {
              if (isNumerica(dif)) {
                if (typeof filter.difficulty.min === "string") {
                  filter.difficulty[index] = parseInt(dif);
                }
              } else {
                throw new Error(
                  "difficulty minimum must be an int  between 0 and 1"
                );
              }
              if (dif < 1 || dif > 5) {
                throw new Error(
                  "difficulty minimum must be an int  between 0 and 1"
                );
              }
            });
          } catch (err) {
            throw new Error(
              "difficulty minimum must be an array of int between 0 and 1"
            );
          }
        }
        if (filter.type) {
          try {
            filter.type.forEach((typ) => {
              if (typeof typ !== "string") {
                throw new Error("filter.type must be an array of string");
              }
            });
          } catch (err) {
            throw new Error("filter.type must be an array of string");
          }
        }
        if (filter.regime) {
          try {
            let isVegetarian;
            let isVegan;
            let isLactoseFree;
            let isGlutenFree;
            filter.regime.forEach((typ) => {
              if (typeof typ !== "string") {
                throw new Error(
                  "filter.regime must be an array of 'gluttenfree','vegetarian','vegan','lactosefree'"
                );
              } else {
                switch (typ) {
                  case "gluttenfree":
                    isGlutenFree = true;
                    break;
                  case "vegan":
                    isVegan = true;
                    break;
                  case "lactosefree":
                    isLactoseFree = true;
                    break;
                  case "vegetarian":
                    isVegetarian = true;
                    break;
                  default:
                    throw new Error(
                      "filter.regime must be an array of 'gluttenfree','vegetarian','vegan','lactosefree'"
                    );
                    break;
                }
              }
            });
            filter.isVegetarian = isVegetarian;
            filter.isLactoseFree = isLactoseFree;
            filter.isVegan = isVegan;
            filter.isGlutenFree = isGlutenFree;
          } catch (err) {
            console.log(err);
            throw new Error(
              "filter.regime must be an array of 'gluttenfree','vegetarian','vegan','lactosefree'"
            );
          }
        }

        req.query.correctFilter = filter;
        return true;
      }),
  ],
  mobileController.initRecette
);
routerMobile.get("/recette/:id", mobileController.getRecettebyId);
routerMobile.post(
  "/user/signup",
  [
    check("userName").not().isEmpty(),

    check("email").custom((val) => {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(val).toLowerCase());
    }),
    check("password").isLength({ min: 6 }),
  ],
  userController.signup
);
routerMobile.post(
  "/user/login",
  [
    check("email").custom((val) => {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(val).toLowerCase());
    }),
    check("password").isLength({ min: 6 }),
  ],
  userController.login
);

routerMobile.use(checkAuth);

routerMobile.get(
  "/recommandation",

  recoController.getreco
);
routerMobile.post(
  "/recommandation",
  [check("type").isIn(["LIKE", "DISLIKE"]), check("recetteId").not().isEmpty()],
  recoController.postreco
);

module.exports = routerMobile;
