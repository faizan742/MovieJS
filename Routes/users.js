const express = require('express');
const UserModel=require("../Models/users");
const JobsModel=require("../Models/jobs");

require("dotenv").config();
const userValidationSchema=require("../Validators/uservalidator")
const Router = express.Router();
const nodemailer=require("nodemailer");
const jwt = require('jsonwebtoken');
const emailMethods = require('../EmailSender/emailquene');
Router.use(express.json());
Router.use(express.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USERMAIL,
    pass: process.env.Password
  }
});
Router
.route('/adduser')
.post((req,res)=>{
  
    const user = new UserModel(req.body);
    const validationResult = userValidationSchema.validation(req.body);
    if (validationResult.error) {
        console.error(validationResult.error.message);
      } else {
        user.save()
        .then((savedUser) => {
          //console.log('User saved successfully',savedUser);
          const addjobs = new JobsModel(req.body);
          addjobs.save().then(()=>{
            emailMethods.SendMAil(addjobs.email);
            res.send(200);
          });              
        })
        .catch((error) => {
          res.send(401);
          console.error('Error saving user:', error);
          
        });
      }
  
});
Router.get('/track-click/:email', (req, res) => {
  try {
  const email = req.params;
  
  const token = jwt.sign({ email:email }, process.env.Secret_KEY, { expiresIn: '1d' });
  console.log(token);  
  res.sendStatus(200);
  } catch (error) {
      res.json(error);    
  }    
  });


Router
.route('/findUsers')
.get((req,res)=>{
  UserModel.find({username:req.body.username,email:req.body.email})
      .then(users => {
        console.log('Users found:', users);
      })
      .catch(error => {
        console.error('Error querying database:', error);
      });
});

Router
.route('/100MAILSUSERS')
.post((req,res)=>{
 for (let index = 0; index < 3; index++) {
  emailMethods.SendMAil('Faizanzia247@gmail.com');
 }  
 res.sendStatus(200);
});

Router
.route('/DeleteMails')
.post((req,res)=>{
 emailMethods.pasueQuene();
 res.sendStatus(200);
});

module.exports=Router;