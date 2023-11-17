const mongoose = require('mongoose');
require("dotenv").config();
mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const FailJobs = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  
  
});

const fjobs = mongoose.model('FailJobs', FailJobs);
module.exports= fjobs;