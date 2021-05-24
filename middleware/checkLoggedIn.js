const Product = require("../model/product");

const authenticateUser = (req, res, next) => {
  if (!req.session.phone) {
    return res.json("not allowednnnnnnnnnnnnnnnnn");
  }
  next();
};

module.exports = { authenticateUser };
