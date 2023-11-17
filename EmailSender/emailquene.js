require("dotenv").config();
const Queue = require('bull');
const nodemailer = require('nodemailer');
const JobsModel=require("../Models/jobs");


const emailQueue = new Queue('email');
function SendMAil(email) {
  console.log(email);
   emailQueue.add({ email: email, subject: 'Verfication Email', body:"Verfication Email Has been Send" ,html:`<html>
                <head>
                  <title>Test Email with Button</title>
                </head>
                <body>
                  <p>This is a test email with a button:</p>
                  <a href="http://localhost:${process.env.PORT}/users/track-click/${email}" target="_blank">
                    <button>Click me!</button>
                  </a>
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
  emailQueue.process((job, done) => {
    
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
              
            } else {
              console.log('Email sent:', info.response);
              JobsModel.deleteOne({email:mailOptions.to}).then((result) => {
                console.log('DELETED '+mailOptions.to)   
              }).catch((err) => {
                console.log('ERROR A G');
              });
              
              
            }
          });

 
  });

emailQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed with error: ${err.message}`);
});

module.exports = {emailQueue,SendMAil}; // Export the emailQueue variable