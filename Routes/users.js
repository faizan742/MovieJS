const express = require('express');
const UserModel=require("../Models/users");
const JobsModel=require("../Models/jobs");
const bcrypt=require('bcrypt');
require("dotenv").config();
const userValidationSchema=require("../Validators/uservalidator")
const Router = express.Router();
const jwt = require('jsonwebtoken');
const emailMethods = require('../EmailSender/emailquene');
Router.use(express.json());
Router.use(express.urlencoded({ extended: true }));

function generateRandomToken(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';

  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      token += characters.charAt(randomIndex);
  }
  return token;
}



function hashPassword(password) {
  return bcrypt.hashSync(password, 6);
}

Router
.route('/adduser')
.post(async (req,res)=>{
    const validationResult = userValidationSchema.validation(req.body);
    if (validationResult.error) {
        console.error(validationResult.error.message);
      } else {
        token = generateRandomToken(16);
        password = await hashPassword(req.body.Password);    
        UserModel.create({...req.body,Token:token,Password:password}).then((savedUser) => {      
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
Router.get('/track-click/:email',async  (req, res) => {
  try {
  const email = req.params;
   
  await UserModel.updateOne({email: email.email},{ $set: { Token:"" } }).then(()=>{
    res.sendStatus(200);
  });    
  
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

Router
.route('/Login')
.post(async (req,res)=>{
  const result1 = await UserModel.find({ email: req.body.email});
    console.log(result1);
    bcrypt.compare(req.body.Password, result1[0].Password, function(err, result) {
    if (result) {
        const token = jwt.sign({ userId: result1[0]._id, username: result1[0].username,admin:result1[0].isAdmin}, process.env.Secret_KEY, { expiresIn: '1d' });
        console.log(token);
        res.send(200);  
    } 
    });
  
  
})

module.exports=Router;