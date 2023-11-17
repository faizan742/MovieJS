const express = require('express');
const GenerModel=require("../Models/genre");
require("dotenv").config();
const userValidationSchema=require("../Validators/genrevalidator");
const Router = express.Router();
Router.use(express.json());
Router.use(express.urlencoded({ extended: true }));

Router
.route('/addgenre')
.post(async (req,res)=>{
  
    const user = new GenerModel(req.body);
    console.log(user);
    const {error} = userValidationSchema.validation(req.body);
    if(error){
      return res.json({
        message:error
      })
    }else {
          user.save()
          .then((savedUser) => {
            console.log('User saved successfully',savedUser);
            return res.status(201).json({ message: 'User saved successfully', user: savedUser }); 
          }).catch((error) => {
            console.error('Error saving user:', error);
            return res.status(500).json({ error: 'Error saving user' });
             
             
            });
      }    
});

Router
.route('/findGenre')
.get((req,res)=>{
  GenerModel.find({name:req.body.name})
      .then((genre) => {
        console.log('Genre found:', genre);
        res.sendStatus(200);
      })
      .catch(error => {
        console.error('Error querying database:', error);
        res.sendStatus(404);
      });
});




module.exports=Router;