const express = require('express');
const CustomerModel=require("../Models/customers");
const CustomerValidator=require("../Validators/customervalidator");
const Middleware1=require("../MiddleWare/auth");
const emailQueue = require('../EmailSender/emailquene');
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


module.exports=Router;