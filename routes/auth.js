"use strict";
const route = require("express").Router();
const auth = require("../controller/auth");

route.post("/login", auth.login);
route.post("/register", auth.register);
route.post("/me", auth.me);
route.post("/logout", auth.logout);

module.exports = route;
