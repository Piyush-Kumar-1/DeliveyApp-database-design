const Order = require("../model/order");
const User = require("../model/user");
const Product = require("../model/product");

const createOrder = (productExists, session) => {
  return new Promise(function (resolve, reject) {
    const order = new Order({
      order: productExists.order,
      customerPhone: session.phone,
      orderStage: "Task Created",
    });

    try {
      Order.create(order, (err, data) => {
        if (err) reject(err);
        resolve(order._id);
      });
    } catch (error) {
      reject(error);
    }
  });
};

exports.order = async (req, res) => {
  if (req.session.type !== "user") {
    return res.json("not allowed for user");
  }
  createOrder(req.body, req.session)
    .then((response) => {
      User.updateOne(
        { phone: req.session.phone },
        { $push: { order: response } },
        function (err, data) {
          if (err) {
            return res.json(err);
          }
        }
      );
      req.body.order.map(async (item) => {
        await Product.updateOne(
          { name: item.name },
          {
            $inc: { quantity: -item.quantity },
          },
          function (err, data) {
            if (err) {
              return res.json(err);
            }
          }
        );
      });
    })
    .catch((err) => console.log(err));
  return res.json("true");
};

exports.getOrder = async (req, res) => {
  if (req.session.type !== "admin") {
    return res.json("not allowed");
  }
  const order = await Order.find({ orderStage: req.body.orderStage });
  res.json(order);
};

exports.getDelivery = async (req, res) => {
  if (req.session.type !== "admin") {
    return res.json("not allowed");
  }
  const user = await User.findOne({
    type: "delivery",
    status: { $ne: "busy" },
  });
  res.json(user);
};

exports.assign = async (req, res) => {
  if (req.session.type !== "admin") {
    return res.json("not allowed");
  }
  Order.updateOne(
    { _id: req.body.orderId },
    { deliveryPersonId: req.body.deliveryId },
    function (err, data) {
      if (err) {
        return res.json(err);
      }
    }
  );
  User.updateOne(
    { _id: req.body.deliveryId },
    { $push: { order: req.body.orderId }, $set: { status: "busy" } },
    function (err, data) {
      if (err) {
        reject(err);
      }
    }
  );
  return "true";
};

exports.updateStatus = async (req, res) => {
  if (req.session.type !== "delivery") {
    return res.json("not allowed");
  }
  Order.updateOne(
    { _id: req.body.id },
    { orderStage: req.body.status },
    function (err, data) {
      if (err) {
        return res.json(err);
      }
    }
  );
  if (req.body.status === "delivered") {
    User.updateOne(
      { phone: req.session.phone },
      { status: "free" },
      function (err, data) {
        if (err) {
          return res.json(err);
        }
      }
    );
  }
  return true;
};
