const Joi = require('joi');

// Define Joi schema for Movie
const movieJoiSchema = Joi.object({
  Moviename: Joi.string().min(3).max(30).required(),
  genre: Joi.string().required(),
  Price: Joi.number().min(250).max(1000),
  ReleaseDate: Joi.string().default(' '),
});

// Define Joi schema for Customer
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