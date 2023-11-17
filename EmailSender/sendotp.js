require("dotenv").config();
const Queue = require('bull');
const nodemailer = require('nodemailer');
const JobsModel=require("../Models/jobs");
const failedJobsModel=require("../Models/failjobs");


const OTPQueue = new Queue('email');

function SendOTP(email) {
    console.log('OTP Email');
  console.log(email);
  const min = 1000; // Minimum 4-digit number
  const max = 9999; // Maximum 4-digit number

  const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  OTPQueue.add({ email: email, subject: 'OTP  Email', body:"Please Enter your OTP SEND IN THIS Email " ,html:`<html>
                <head>
                  <title>Test Email with Button</title>
                </head>
                <body>
                  <p>This Random Number</p>
                  <p>${randomNum}</p>
                </body>
              </html>` });
}


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USERMAIL,
      pass: process.env.Password,
    }
  });
  OTPQueue.process((job, done) => {
    
    const mailOptions = {
          from: process.env.USERMAIL,
          to: job.data.email,
          subject: job.data.subject,
          text: job.data.body,
          html:job.data.html
        };
    
    transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error('Error:', error);
              const FEmail=new failedJobsModel({email:mailOptions.to});
              FEmail.save();
            } else {
              console.log('Email sent:', info.response);
              JobsModel.deleteOne({email:mailOptions.to}).then((result) => {
                   
              }).catch((err) => {
                console.log('ERROR A G');
              });
              
              
            }
          });

 
  });

  OTPQueue.on('failed', (job, err) => {
    const FEmail=new failedJobsModel({email:job.data.email});
    FEmail.save();  
    console.error(`Job ${job.id} failed with error: ${err.message}`);
});

function pasueQuene() {
  OTPQueue.pause();
  OTPQueue.empty().then(() => {
    console.log('Queue emptied successfully.');
  }).catch((err) => {
    console.error('Error emptying the queue:', err);
  });
  OTPQueue.clean(0, 'failed').then(() => {
    console.log('Failed jobs removed successfully.');
  }).catch((err) => {
    console.error('Error removing failed jobs:', err);
  });
  OTPQueue.resume();
}

module.exports = {OTPQueue,SendOTP,pasueQuene}; // Export the OTPQueue variable
