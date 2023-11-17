const Joi = require('joi');

const customerJoiSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(18).max(100),
  state: Joi.string().default('Silver'),
});
function validation(userObject){
  return customerJoiSchema.validate(userObject)
}
module.exports={validation};