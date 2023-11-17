const mongoose = require('mongoose');
require("dotenv").config();
mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const MovieScheme = new mongoose.Schema({
  Moviename: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
    unique: true,
  },
  genre: {
    type: String,
    required: true,
  },
  Price: {
    type: Number,
    min: 250,
    max: 1000,
  },
  ReleaseDate:{
    type:String,
    default:" ",
  }
});

const movie = mongoose.model('Movies', MovieScheme);
module.exports= movie;