const express = require('express');
const MovieModel=require("../Models/movie");
const GenerModel=require("../Models/genre");
const movieValidator=require("../Validators/movievalidator");
const gener = require('../Models/genre');

require("dotenv").config();

const Router = express.Router();
Router.use(express.json());
Router.use(express.urlencoded({ extended: true }));

Router
.route('/addmovie')
.post(async (req,res)=>{
  try {
    var user;
    var genre;
    await GenerModel.findOne({name:req.body.genrename},'name').then((result)=>{
    console.log(result);
    genre=result.name;
    });
    
    if(genre==null){
      console.log('NOT FOUND GENRE');
    }else
    {
        user = new MovieModel({...req.body,genre: genre,});
        const validationResult = movieValidator.validation(req.body);

      if (validationResult.error) {
        console.error(validationResult.error.message);
      } else {
        user.save()
        .then((result) => {
          console.log('Movie saved successfully',result);
          res.sendStatus(201); 
        })
        .catch((error) => {
          res.sendStatus(401);
          console.error('Error saving user:', error);
        });
      }

    }
  } catch (error) {
    
    res.sendStatus(401);
  }
  
});

Router
.route('/findMovie')

.get((req,res)=>{
  try {
    MovieModel.findOne({Moviename:req.query.Moviename})
    .then((result) => {
      res.json(result);
    })

  } catch (error) {
   res.send(401);
   console.log(error);
  }
  
});


Router
.route('/deleteMovie')
.post((req,res)=>{
  try {
    MovieModel.deleteOne({Moviename:req.body.Moviename})
    .then((result) => {
      console.log('Movie Deleted:', result);
      res.sendStatus(200);
    })
  } catch (error) {
   res.send(401);
   console.log(error);
  }
});

Router
.route('/UpadateMovie')
.post((req,res)=>{

  try {
    MovieModel.updateOne({Moviename:req.body.Moviename},{$set:{Price:req.body.Price}})
    .then((result) => {
      console.log('Movie Upadtes:', result);
      res.json(result);
    })
  
  } catch (error) {
   res.send(401);
   console.log(error);
  }
});



module.exports=Router;