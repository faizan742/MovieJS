const express = require('express');
const MovieModel=require("../Models/movie");
const GenerModel=require("../Models/genre");
const movieValidator=require("../Validators/movievalidator");

require("dotenv").config();

const Router = express.Router();
Router.use(express.json());
Router.use(express.urlencoded({ extended: true }));

Router
.route('/addmovie')
.post(async (req,res)=>{
  try {
    genre=await GenerModel.find({name:req.body.genrename},'name');
    const user = new MovieModel({...req.body,genre: genre[0].name,});
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
  } catch (error) {
    res.sendStatus(401).send({err : error});
  }
  
});

Router
.route('/findMovie')
.post((req,res)=>{
  MovieModel.find({Moviename:req.body.Moviename})
      .then((result) => {
        console.log('Movie found:', result);
        res.sendStatus(200);
      })
      .catch(error => {
        console.error('Error querying database:', error);
        res.sendStatus(404);
      });
});


Router
.route('/deleteMovie')
.post((req,res)=>{
  MovieModel.deleteOne({Moviename:req.body.Moviename})
      .then((result) => {
        console.log('Movie Deleted:', result);
        res.sendStatus(200);
      })
      .catch(error => {
        console.error('Error querying database:', error);
        res.sendStatus(404);
      });
});

Router
.route('/UpadateMovie')
.post((req,res)=>{
  MovieModel.updateOne({Moviename:req.body.Moviename},{$set:{Price:req.body.Price}})
      .then((result) => {
        console.log('Movie Upadtes:', result);
        res.sendStatus(200);
      })
      .catch(error => {
        console.error('Error querying database:', error);
        res.sendStatus(404);
      });
});



module.exports=Router;