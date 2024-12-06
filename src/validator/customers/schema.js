const Joi = require('joi');

const CustomersPayloadSchema = Joi.object({
  name: Joi.string().required(),
  number: Joi.number().required(),
  address: Joi.string().required(),
});

module.exports = { CustomersPayloadSchema };