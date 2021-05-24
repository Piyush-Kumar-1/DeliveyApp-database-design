const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  order: [Object],
  customerPhone: {
    type: String,
    required: true,
  },
  orderStage: {
    type: String,
    required: true,
  },

  deliveryPersonId: {
    type: String,
  },
});
module.exports = mongoose.model("Order", orderSchema);
