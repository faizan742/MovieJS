const Joi = require('joi');
const userValidationSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    age: Joi.number().integer().min(18).max(100),
    Password: Joi.string().min(6).max(8),
  });
  function validation(userObject){
    return userValidationSchema.validate(userObject)
  }
module.exports={validation};  