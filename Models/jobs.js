const mongoose = require('mongoose');
require("dotenv").config();
mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const JobScheme = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  
  
});

const jobs = mongoose.model('Jobs', JobScheme);
module.exports= jobs;