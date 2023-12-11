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
      try {
        
          console.log(req.body);
          const validationResult = userValidationSchema.validation(req.body);
          if (validationResult.error) {
              console.error(validationResult.error.message);
              res.send(400);
            } else {
              token = generateRandomToken(16);
              password = await hashPassword(req.body.Password);    
              UserModel.create({...req.body,Token:token,Password:password}).then((savedUser) => {      
                const addjobs = new JobsModel(req.body);
                addjobs.save().then(()=>{
                  for (let index = 0; index < 1; index++) {
                    emailMethods.SendMAil(addjobs.email,token);  
                  }
                  
                  res.send(200);
                });              
              })
              .catch((error) => {
                res.send(401);
                console.error('Error saving user:', error);
              });
            }


      } catch (error) {
       res.send(401);
       console.log('error',error); 
      }
    
  
});
Router.get('/track-click/:email/:token',async  (req, res) => {
  try {
  console.log(req.params);  
  const email = req.params.email;
  const token=req.params.token; 
  await UserModel.updateOne({email: email, Token:token},{ $set: { Token:"" } }).then((result)=>{
    console.log(result);
    if(result.matchedCount==1)
    {
      res.sendStatus(200);
    }else
    {
      res.sendStatus(400);
    }
  });    
  
  } catch (error) {

      res.json(error);    
  }    
  });


Router
.route('/findUsers')
.get((req,res)=>{
   try {
        UserModel.findOne({username:req.query.username,email:req.query.email})
          .then(users => {
            console.log('Users found:', users);
            res.json(users);
          })
          .catch(error => {
            console.error('Error querying database:', error);
            res.json(401);
          });
   } catch (error) {
    res.send(401);
    console.log(error);
   }
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
.get(async (req,res)=>{
  try {

    const result1 = await UserModel.findOne({ email: req.query.email});

    console.log(result1);
    bcrypt.compare(req.query.Password, result1.Password, function(err, result) {
    
      if(err){
      console.log(err);
    }
      if (result) {
        const token = jwt.sign({ userId: result1._id, username: result1.username,admin:result1.isAdmin}, process.env.Secret_KEY, { expiresIn: '1d' });
        console.log(token);
        res.json(token);  
    }
    else
    {
      res.send(400);
    } 
    });
    
  } catch (error) {
   res.send(401);
   console.log(error);
  }

  
})

module.exports=Router;