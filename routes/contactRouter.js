const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config ();


router.post('/',(req,res) =>{ 
    const{name,email,message} =req.body;
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
    port: 465,
    secure: true,
        auth: {
            user: process.env.USER,
            pass: process.env.PASS
        }
      });
      
      let mailOptions = {
        from: email,
        to: 'ashleykannemeyer2@gmail.com',
        subject: 'From nike store',
        text: `
        Email:${email}
        Name: ${name}
        Message: ${message}


        
        `,
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          res.status(400).send({msg:"error"+error})
        } else {
          console.log('Email sent: ' + info.response);
          res.send({msg:"Message Sent "})
        }
      });
    
    
});


module.exports = router;