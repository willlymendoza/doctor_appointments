const Joi = require("@hapi/joi");

/* Register Validation */
const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(5).required(),
    last_name: Joi.string().min(5).required(),
    phone_number: Joi.string().min(8).required(),
    email: Joi.string().email().min(8).required(),
    address: Joi.string().min(5).required(),
    is_doctor: Joi.boolean().required(),
    password: Joi.string().min(8).required(),
  });

  return schema.validate(data);
};

/* Login Validation */
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().min(8).required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

/* Register Validation */
const updateValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(5).required(),
    last_name: Joi.string().min(5).required(),
    phone_number: Joi.string().min(8).required(),
    email: Joi.string().email().min(8).required(),
    address: Joi.string().min(5).required(),
    is_doctor: Joi.boolean().required(),
  });

  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.updateValidation = updateValidation;
