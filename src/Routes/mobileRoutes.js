import { Router } from "express";
import {
  getRecettebyId,
  autocompleteIngr,
  searchByName,
  autocompleteNameRecette,
  searchByIngrId,
} from "../Controller/mobileController";
const { check, isISO8601 } = require("express-validator");

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
          try {
            filter.difficulty.forEach((typ) => {
              if (
                typeof typ !== "string" ||
                (typ !== "facile" && typ !== "moyen" && typ !== "difficile")
              ) {
                throw new Error(
                  "filter.difficulty must be an array of 'facile','moyen','difficile',"
                );
              }
            });
          } catch (err) {
            throw new Error(
              "filter.difficulty must be an array of 'facile','moyen','difficile',"
            );
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
    check("idIngrs").not().isEmpty(),
    check("idIngrs").isArray(),
    check("idIngrs").custom((value) => {
      let arrayId = [];
      try {
        value.forEach((val) => {
          arrayId.push(ObjectId(val));
        });
      } catch (err) {
        console.log(err);
        return false;
      }
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
            filter.difficulty.forEach((typ) => {
              if (
                typeof typ !== "string" ||
                (typ !== "facile" && typ !== "moyen" && typ !== "difficile")
              ) {
                throw new Error(
                  "filter.difficulty must be an array of 'facile','moyen','difficile',"
                );
              }
            });
          } catch (err) {
            throw new Error(
              "filter.difficulty must be an array of 'facile','moyen','difficile',"
            );
          }
        }
        req.query.correctFilter = filter;
        return true;
      }),
  ],
  searchByIngrId
);
routerMobile.get("/:id", getRecettebyId);

export default routerMobile;
