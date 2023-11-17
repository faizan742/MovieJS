const express = require('express');
const users=require('./Routes/users');
const customer=require('./Routes/customer');
const genre=require('./Routes/genre');
const movie=require('./Routes/movie');
const rental=require('./Routes/rental');

require("dotenv").config();

const app = express();
const port = process.env.PORT || '8000';

app.use("/users",users);
app.use("/customers",customer);
app.use("/Genre",genre);
app.use("/Movie",movie);
app.use("/Rental",rental);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send('HI There this is base ');
  });
  
app.listen(port, (err) => {
    if (err) {
      return console.log('ERROR: ' + err);
    }
    console.log('Listening on Port ' + port);
  });

app.set('view engine', 'ejs');
app.set('views', './View');
