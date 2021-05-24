const joi = require("@hapi/joi");

const regValidation = (data) => {
  const schema = joi.object({
    name: joi.string().required(),
    phone: joi.number().required(),
    password: joi.string().required().min(6),
    type: joi.string().required(),
  });
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = joi.object({
    phone: joi.string().required(),
    password: joi.string().required().min(6),
  });
  return schema.validate(data);
};

module.exports.regValidation = regValidation;
module.exports.loginValidation = loginValidation;
