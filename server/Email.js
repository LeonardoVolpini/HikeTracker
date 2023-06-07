const express = require('express');
const email = express.Router();
const dao = require('./DAO');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
//  creat a sender
const transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 465,
    secureConnection: true, // use SSL
    auth: {
        user: '736076274@qq.com', 
        pass: 'xbqaupxwxmbnbeae', 
    },
});

email.post('/getCode/:email',async (req, res) => {
    const to=req.params.email;
    let code = Math.floor(crypto.randomBytes(1).readUInt8(0)*crypto.randomBytes(1).readUInt8(0)*90) +100
    console.log(req.body.phoneNumber);
    const mailOptions = {
        from:'"HIKETRACKER"<736076274@qq.com>',
        to, 
        subject:'This is your Verification Code', // title
       html:`<div style="vh-100 justify-content-md-center"><h1 style="text-align:center;">${code}</h1></div>`
    };
    //  send
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) return console.log(error);
        console.log(info);
    });
    dao.addCode(to,code,req.body.name,req.body.lastname,req.body.role,req.body.password,req.body.phoneNumber).then(
        result => {
            return res.status(200).json();                       
        },
        error => {
            dao.updateCode(to,code).then(
                result => {
                    return res.status(200).json();                       
                },
                error => {
                    return res.status(500).send(error);
                }
            );
        }
    )
   

});

email.get('/notice1/:email',async (req, res) => {
    const to=req.params.email;
    const mailOptions = {
        from:'"HIKETRACKER"<736076274@qq.com>',
        to, 
        subject:'Your account is available now ', // title
       html:`<div style="vh-100 justify-content-md-center"><h1 style="text-align:center;">Your account has been verified, You can login now!</h1></div>`
    };
    //  send
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) return console.log(error);
        console.log(info);
    });
        return res.status(200).json();                      
})

email.get('/notice2/:email',async (req, res) => {
    const to=req.params.email;
    const mailOptions = {
        from:'"HIKETRACKER"<736076274@qq.com>',
        to, 
        subject:'Your sign up request has been reject ', // title
       html:`<div style="vh-100 justify-content-md-center"><h1 style="text-align:center;">Your request has been reject, please check you information!</h1></div>`
    };
    //  send
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) return console.log(error);
        console.log(info);
    });
        return res.status(200).json();                      
})

module.exports = email;
