const Joi = require('joi');

const genreJoiSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
});


function validation(userObject){
  return genreJoiSchema.validate(userObject)
}
module.exports={validation};