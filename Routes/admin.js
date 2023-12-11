const express = require('express');
const UserModel=require("../Models/users");
const TaskModel=require("../Models/Tasks");
const JobsModel=require("../Models/jobs");
const bcrypt=require('bcrypt');
require("dotenv").config();
const userValidationSchema=require("../Validators/uservalidator")
const Router = express.Router();
const jwt = require('jsonwebtoken');
const emailMethods = require('../EmailSender/emailquene');
const MiddleAuth1=require('../MiddleWare/auth');
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
.route('/addAdmins')
.post(MiddleAuth1.AdmincheckJWT,async (req,res)=>{
    const validationResult = userValidationSchema.validation(req.body);
    if (validationResult.error) {
        console.error(validationResult.error.message);
      } else {
        token = generateRandomToken(16);
        password = await hashPassword(req.body.Password);    
        UserModel.create({...req.body,Token:token,Password:password,GaveTicket:true,
            isAdmin:true,}).then((savedUser) => {      
          const addjobs = new JobsModel(req.body);
          addjobs.save().then(()=>{
            emailMethods.SendMAil(addjobs.email,token);
            res.send(200);
          });              
        })
        .catch((error) => {
          res.send(401);
          console.error('Error saving user:', error);
        });
      }
  
});





Router
.route('/AddTask')
.post( async (req,res)=>{
await TaskModel.create(req.body).then(()=>{
    res.sendStatus(200);
}).catch((err)=>{
res.json(err);
})    
 
});

Router
.route('/DeleteTask')
.get( async (req,res)=>{
    await TaskModel.updateOne({task:req.query.task},{$set:{isdelete:true}}).then(()=>{
        res.sendStatus(200);
    }).catch((err)=>{
    res.json(err);
    }) 
});

Router
.route('/ListTask')
.get( async (req,res)=>{
    await TaskModel.find({isdelete: { $eq:false }}).then((result)=>{
        res.json(result);
    }).catch((err)=>{
    res.json(err);
    })
});

Router
.route('/Login')
.post(async (req,res)=>{
  try {
    const result1 = await UserModel.findOne({ email: req.body.email})
    console.log(result1);
    var token="";
      bcrypt.compare(req.body.Password, result1.Password, function(err, result) {
      if (result) {
          
          token = jwt.sign({ userId: result1._id, username: result1.username,admin:result1.isAdmin}, process.env.Secret_KEY, { expiresIn: '1d' });
          console.log(token); 
          res.json(token);            
      } 
  
      });  
  } catch (error) {
   res.send(401);
   console.log(error);
  }
  
})

module.exports=Router;