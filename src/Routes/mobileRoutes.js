import { Router } from "express";
import {
  getRecettebyId,
  autocompleteIngr,
  searchByName,
  autocompleteNameRecette,
  searchByIngr,
} from "../Controller/mobileController";
const { check, isISO8601 } = require("express-validator");
const mongoose = require("mongoose");

const routerMobile = Router();

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
          if (filter.difficulty.min) {
            try {
              if (isNumerica(filter.difficulty.min)) {
                if (typeof filter.difficulty.min === "string") {
                  filter.difficulty.min = parseInt(filter.difficulty.min);
                }
              } else {
                throw new Error("difficulty minimum must be an int");
              }
            } catch (err) {
              throw new Error("difficulty minimum must be an int");
            }
          }
          if (filter.difficulty.max) {
            try {
              if (isNumerica(filter.difficulty.max)) {
                if (typeof filter.difficulty.max === "string") {
                  filter.difficulty.max = parseInt(filter.difficulty.max);
                }
              } else {
                throw new Error("difficulty maximum must be an int");
              }
            } catch (err) {
              throw new Error("difficulty maximum must be an int");
            }
          }
        }
        req.query.correctFilter = filter;
        return true;
      }),
  ],
  searchByName
);
routerMobile.get(
  "/autocomplete/ingredient",
  [check("keyword").not().isEmpty(), check("keyword").isString()],
  autocompleteIngr
);
routerMobile.get(
  "/autocomplete/recetteName",
  [check("keyword").not().isEmpty(), check("keyword").isString()],
  autocompleteNameRecette
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
          if (filter.difficulty.min) {
            try {
              if (isNumerica(filter.difficulty.min)) {
                if (typeof filter.difficulty.min === "string") {
                  filter.difficulty.min = parseInt(filter.difficulty.min);
                }
              } else {
                throw new Error("difficulty minimum must be an int");
              }
            } catch (err) {
              throw new Error("difficulty minimum must be an int");
            }
          }
          if (filter.difficulty.max) {
            try {
              if (isNumerica(filter.difficulty.max)) {
                if (typeof filter.difficulty.max === "string") {
                  filter.difficulty.max = parseInt(filter.duration.max);
                }
              } else {
                throw new Error("difficulty maximum must be an int");
              }
            } catch (err) {
              throw new Error("difficulty maximum must be an int");
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

        req.query.correctFilter = filter;
        return true;
      }),
  ],
  searchByIngr
);
routerMobile.get("/:id", getRecettebyId);

export default routerMobile;
