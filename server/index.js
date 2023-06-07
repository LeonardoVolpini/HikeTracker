'use strict';

const express = require('express');
const dao = require('./DAO');
const upload = require("./upload")
const upload_pictures= require("./upload_pictures")
const multer = require("multer")
const path = require('path');
const userDao = require('./user-dao.js');
const hikeRouter = require('./hikeRouter');
const email = require('./Email');
const cors = require('cors');
const morgan = require('morgan'); // logging middleware
const PREFIX = '/api';

//1 STEP PASSPORT-->Passport-related imports
const passport = require('passport');
const LocalStrategy = require('passport-local');
//5 STEP EXPRESS-SESSION-->Express-session related imports
const session = require('express-session');

const app = express();

// set up the middlewares
app.use(morgan('dev'));
app.use(express.json());

//corsOptions
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));
app.use('/api', hikeRouter);
app.use('/email', email);
//2 STEP PASSPORT-->Passport: set up local strategy-->TODO in USER-DAO
passport.use(new LocalStrategy(async function verify(username, password, cb) {
  //4 STEP PASSPORT-->getUser in the verify method-->vedi come implemento "getUser" nel "userDao"
  const user = await userDao.getUser(username, password)

  //4.4 STEP PASSPORT-->CALLBACK cb check if returned "user" is correct or not
  if (!user)
    return cb(null, false, 'Incorrect username and/or password.');
  return cb(null, user);
}));

//7 STEP EXPRESS-SESSION-->Express-session-->Session Personalization
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});



//6 STEP EXPRESS-SESSION-->Express-session installed on Passport
app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));
//3/6.1 STEP PASSPORT/EXPRESS-->Install in our application the local strategy of Passport and Express-Session-->app.use(...)
app.use(passport.authenticate('session'));

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Not authorized because not logged in' });
}

/**************** Users APIs ********************/

//login
app.post(PREFIX + '/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // display wrong login messages
      return res.status(401).json({ error: info });
    }
    // success, perform the login and extablish a login session
    req.login(user, (err) => {
      if (err)
        return next(err);
      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUser() in LocalStratecy Verify Fn
      return res.json(req.user);
    });
  })(req, res, next);
});

// check whether the user is logged in or not
app.get(PREFIX + '/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  else
    res.status(401).json({ error: 'Not authenticated' });
});

// DELETE /api/v0/session/current
app.delete(PREFIX + '/sessions/current', (req, res) => {
  req.logout(() => {
    res.status(200).end();
  });
});

//*******************UPLOAD API********************** */ 

app.use(function (err, req, res, next) {
  // Check if the error is thrown from multer
  if (err instanceof multer.MulterError) {
    res.statusCode = 400
    res.send({ code: err.code })
  } else if (err) {
    // If it is not multer error then check if it is our custom error for FILE_MISSING
    if (err.message === "FILE_MISSING") {
      res.statusCode = 400
      res.send({ code: "FILE_MISSING" })
    } else {
      //For any other errors set code as GENERIC_ERROR
      res.statusCode = 500
      res.send({ code: "GENERIC_ERROR" })
    }
  }
})

app.post("/upload_file", upload.single("file"), function (req, res) {
  if (!req.file) {
    //If the file is not uploaded, then throw custom error with message: FILE_MISSING
    throw Error("FILE_MISSING")
  } else {
    //If the file is uploaded, then send a success response.
    res.send({ status: "success" })
  }
})
app.get(PREFIX+'/Maps/:name', (req, res, next) => {
  const fileName = req.params.name;
  const options = {
    root: path.join(__dirname,'/uploads')
  };
  res.sendFile(fileName, options, (err) => {
      if (err) {
          next(err);
      } else {
          console.log('File Sent:', fileName);
      }
  });
});

app.post("/upload_pictures", upload_pictures.single("file"), function (req, res) {
  if (!req.file) {
    //If the file is not uploaded, then throw custom error with message: PICTURE_MISSING
    throw Error("PICTURE_MISSING")
  } else {
    //If the file is uploaded, then send a success response.
    res.send({ status: "success" })
  }
})

app.get(PREFIX+'/Pictures/:name', (req, res, next) => {
  console.log("Inside pictures.get")
  console.log(req.params.name)
  const fileName = req.params.name;
  const options = {
    root: path.join(__dirname,'/pictures')
  };
  res.sendFile(fileName, options, (err) => {
      if (err) {
          next(err);
      } else {
          console.log('File Sent:', fileName);
      }
  });
});

//SERVER RUNNING
app.listen(3001, () => { console.log('Server running on Port: 3001') });

module.exports = app;