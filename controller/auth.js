const User = require("../model/user");
const { regValidation, loginValidation } = require("../validation");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  const { error } = regValidation(req.body);
  if (error) return res.json(error.details[0].message);
  const phoneExists = await User.findOne({ phone: req.body.phone });
  console.log(phoneExists);
  if (phoneExists) return res.send("email exists").status(400);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    phone: req.body.phone,
    password: hashedPassword,
    type: req.body.type,
  });

  try {
    User.create(user, (err, data) => {
      console.log(data);
      if (err) return res.json(err).status(400);
      req.session.phone = user.phone;
      req.session.type = user.type;
      return res.json(req.session).status(201);
    });
  } catch (error) {
    res.send("error");
  }
};

exports.login = async (req, res) => {
  console.log(req.body.phone.length);
  const { error } = loginValidation(req.body);
  if (error) return res.json(error.details[0].message);
  const user = await User.findOne({ phone: req.body.phone });
  if (!user) return res.json("email does not exists").status(400);
  console.log(user);
  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.json("password not valid").status(400);
  req.session.phone = user.phone;
  req.session.type = user.type;
  return res.json(req.session);
};

exports.me = async (req, res) => {
  console.log("me", req.session);
  const user = await User.findOne({ phone: req.session.phone });

  if (user) {
    return res.json(user);
  }
  return null;
};

exports.logout = async (req, res) => {
  res.clearCookie("qid");
  req.session.destroy((err) => {
    if (err) {
      res.json(false);
      return;
    }
    return res.json(true);
  });
};
