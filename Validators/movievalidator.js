const Joi = require('joi');
const movie = require('../Models/movie');

const movieJoiSchema = Joi.object({
  Moviename: Joi.string().min(3).max(30).required(),
  genrename: Joi.string().required(),
  Price: Joi.number().min(250).max(1000),
  ReleaseDate: Joi.string().default(' '),
});
function validation(userObject){
  return movieJoiSchema.validate(userObject)
}
module.exports={validation};