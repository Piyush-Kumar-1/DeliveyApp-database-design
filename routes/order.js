"use strict";
const route = require("express").Router();
const order = require("../controller/order");
const { authenticateUser } = require("../middleware/checkLoggedIn");

route.post("/order", authenticateUser, order.order);
route.get("/getOrder", authenticateUser, order.getOrder);
route.get("/getDelivery", authenticateUser, order.getDelivery);
route.post("/assign", authenticateUser, order.assign);
route.post("/updateStatus", authenticateUser, order.updateStatus);

module.exports = route;
