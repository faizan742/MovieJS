
const mongoose = require('mongoose');
require("dotenv").config();
mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const TaskSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
  },
  isdelete:{
    type:Boolean,
    default:false
  }
  
});

const tasks = mongoose.model('Tasks', TaskSchema);
module.exports= tasks;

