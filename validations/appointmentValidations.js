const Joi = require("@hapi/joi");

/* Register Validation */
const createValidation = (data) => {
  const schema = Joi.object({
    appointment_date: Joi.date().iso().required(),
    hour: Joi.string().min(4).max(10).required(),
    observations: Joi.string().max(250),
    prescription: Joi.string().max(250),
    patient_id: Joi.string().required(),
    doctor_id: Joi.string().required(),
    created_by_id: Joi.string().required(),
  });

  return schema.validate(data);
};

/* Login Validation */
const updateValidation = (data) => {
  const schema = Joi.object({
    appointment_date: Joi.date().iso().required(),
    hour: Joi.string().min(4).max(10).required(),
    observations: Joi.string().max(250),
    prescription: Joi.string().max(250),
    patient_id: Joi.string().required(),
    doctor_id: Joi.string().required(),
    is_finished: Joi.boolean().required(),
  });

  return schema.validate(data);
};

module.exports.createValidation = createValidation;
module.exports.updateValidation = updateValidation;