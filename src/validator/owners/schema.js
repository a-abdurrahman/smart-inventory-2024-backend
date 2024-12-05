const Joi = require('joi');

const OwnersPayloadSchema = Joi.object({
  businessName: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().required(),
});

module.exports = { OwnersPayloadSchema };