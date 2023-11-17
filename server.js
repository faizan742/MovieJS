const express = require('express');
const users=require('./Routes/users');
const customer=require('./Routes/customer');
const genre=require('./Routes/genre');
const movie=require('./Routes/movie');
const rental=require('./Routes/rental');
const cron = require('node-cron');
const fetch = require('node-fetch');
const weathervalue=require('./Models/Weatherdata');
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

const myTask = async () => {
  apiUrl= 'https://api.openweathermap.org/data/2.5/weather?lat=74.3587&lon=31.5204&appid=eefef0619265f0200bd6693dc4ddc80f';
  try {
    const response = await fetch(apiUrl);
    if (response.ok) {
      const data = await response.json();
      console.log('Weather data SEND:');
      weathervalue(data);
    } else {
      console.log('Request failed with status:', response.status);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

cron.schedule('0 10 * * * *', myTask);