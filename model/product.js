const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: [Object],

  quantity: { type: Number },
});
module.exports = mongoose.model("Product", productSchema);
