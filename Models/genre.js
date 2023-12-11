const mongoose = require('mongoose');
require("dotenv").config();
mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const generScheme = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    minlength: 3,
    maxlength: 30,
    
  },
  
});

const gener = mongoose.model('Genres', generScheme);
module.exports = gener;