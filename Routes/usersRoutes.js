const express = require("express");
const routerUsers = express.Router();
const usersController = require("../Controller/usersController");

routerUsers.get("/", usersController.getUsers);
routerUsers.post("/", [], usersController.postUsers);
routerUsers.post("/login", [], usersController.login);

module.exports = routerUsers;