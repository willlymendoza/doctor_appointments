const Joi = require("@hapi/joi");

/* Register Validation */
const createValidation = (data) => {
  const schema = Joi.object({
    first_name: Joi.string().min(5).required(),
    last_name: Joi.string().min(5).required(),
    personal_document_id: Joi.string().min(5).required(),
    phone_number: Joi.string().min(8).required(),
    email: Joi.string().email().min(8).required(),
    city: Joi.string().min(3).required(),
    address: Joi.string().min(5).required(),
    sex: Joi.string().min(1).required(),
    age: Joi.number().min(1).max(150).required(),
  });

  return schema.validate(data);
};

/* Login Validation */
const updateValidation = (data) => {
  const schema = Joi.object({
    first_name: Joi.string().min(5).required(),
    last_name: Joi.string().min(5).required(),
    personal_document_id: Joi.string().min(5).required(),
    phone_number: Joi.string().min(8).required(),
    email: Joi.string().email().min(8).required(),
    city: Joi.string().min(3).required(),
    address: Joi.string().min(5).required(),
    sex: Joi.string().min(1).required(),
    age: Joi.number().min(1).max(150).required(),
  });

  return schema.validate(data);
};

module.exports.createValidation = createValidation;
module.exports.updateValidation = updateValidation;
