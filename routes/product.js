"use strict";
const route = require("express").Router();
const product = require("../controller/product");
const { authenticateUser } = require("../middleware/checkLoggedIn");

route.post("/post", authenticateUser, product.post);
route.get("/get", authenticateUser, product.get);

module.exports = route;
