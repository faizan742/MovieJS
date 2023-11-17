const express = require('express');
const MovieModel=require("../Models/movie");
const RentalModel=require("../Models/rental");
const CustomerModel=require("../Models/customers");
const rentalValidator=require("../Validators/rentalvalidator");



require("dotenv").config();

const Router = express.Router();
Router.use(express.json());
Router.use(express.urlencoded({ extended: true }));

Router
.route('/addrental')
.post(async (req,res)=>{
  try {
    const movie = await MovieModel.find({Moviename:req.body.Moviename});
    const customer = await CustomerModel.find({username:req.body.customername});
    console.log(movie,customer);
    const user = new RentalModel({
      Movie: movie[0],
      Customer:customer[0]
      });
        user.save()
        .then((result) => {
          console.log('Movie saved successfully',result);
          res.sendStatus(201); 
        })
        .catch((error) => {
          res.sendStatus(401);
          console.error('Error saving user:', error);
          
        });
           
   
  } catch (error) {
    res.sendStatus(401).send({err : error});
  }
});

Router
.route('/findRental')
.post((req,res)=>{
  RentalModel.find({"Customer.username":req.body.name})
      .then((result) => {
        console.log('Rental found:', result);
        res.sendStatus(200);
      })
      .catch(error => {
        console.error('Error querying database:', error);
        res.sendStatus(404);
      });
});


Router
.route('/deleteRental')
.post((req,res)=>{
  RentalModel.deleteOne({"Customer.username":req.body.name})
      .then((result) => {
        console.log('Rental Deleted:', result);
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
  RentalModel.updateOne({"Customer.username":req.body.name},{$set:{Price:req.body.Price}})
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