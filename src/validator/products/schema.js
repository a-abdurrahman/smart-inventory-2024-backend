const Joi = require('joi');

const ProductsPayloadSchema = Joi.object({
  name: Joi.string().required(),
  quantity: Joi.number().required(),
  safeQuantity: Joi.number().required(),
});

module.exports = { ProductsPayloadSchema };