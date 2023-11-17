const express = require('express');
const CustomerModel=require("../Models/customers");
const CustomerValidator=require("../Validators/customervalidator");
const Middleware1=require("../MiddleWare/auth");
const OTPMethods = require('../EmailSender/sendotp');
const JobsModel=require("../Models/jobs");

require("dotenv").config();


const Router = express.Router();
Router.use(express.json());
Router.use(express.urlencoded({ extended: true }));

Router
.route('/addcustomers')
.post(Middleware1.checkJWT,(req,res)=>{
  try {
  const user = new CustomerModel(req.body);
  const validationResult = CustomerValidator.validation(req.body);
  if (validationResult.error) {
    console.error(validationResult.error.message);
  } else {
    user.save()
    .then((savedUser) => {
      console.log('User saved successfully',savedUser);
      const addjobs = new JobsModel(req.body);
          addjobs.save().then(()=>{
            OTPMethods.SendOTP(req.body.email);
            res.sendStatus(200);
          });
       
    }).catch((error) => {
      res.sendStatus(401);
      console.error('Error saving user:', error);
      
    });  
  }
  } catch (error) {
    res.sendStatus(401).send({err : error});
  }
    
});

Router
.route('/findCustomers')
.get((req,res)=>{
  CustomerModel.find({username:req.body.username,email:req.body.email})
      .then(users => {
        console.log('Customer found:', users);
        res.sendStatus(200);
      })
      .catch(error => {
        console.error('Error querying database:', error);
        res.sendStatus(404);
      });
});

Router
.route('/ChangeState')
.post((req,res)=>{
  
  CustomerModel.updateOne({email:req.body.email},{$set:{state:req.body.state}})
    .then((result) => {
      console.log('User Updated successfully',result);
      res.sendStatus(201); 
    })
    .catch((error) => {
      res.sendStatus(401);
      console.error('Error saving user:', error);
    });  
});

Router
.route('/100MAILSCustomers')
.post((req,res)=>{
 for (let index = 0; index < 3; index++) {
  OTPMethods.SendOTP('Faizanzia742@gmail.com');
  
 }  
 res.sendStatus(200);
});


Router
.route('/DeleteMails')
.post((req,res)=>{
 OTPMethods.pasueQuene();
 res.sendStatus(200);
});
module.exports=Router;