const Joi = require('joi');
 
const PostAuthenticationPayloadSchema = Joi.object({
  email: Joi.string(),
  username: Joi.string(),
  password: Joi.string().required(),
}).xor('email', 'username') ;
 
const PutAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
 
const DeleteAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
 
module.exports = {
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema,
};