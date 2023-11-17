const mongoose = require('mongoose');
require("dotenv").config();
mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const RentalScheme = new mongoose.Schema({
  Movie: {
    type: Object,
    required: true,
  },
  Customer :{
    type: Object,
    required: true,
  },
  
});

const rental = mongoose.model('Rentals', RentalScheme);
module.exports= rental;