const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();
const smtpTransport = require('../config/mailer');
const { ensureAuthenticated, adminAuthentication } = require('../helpers/auth');

// ______________Models ___________
//Load User Model
require('../models/User');
const User = mongoose.model('users');
require('../models/Shows');
const Show = mongoose.model('shows');

//__________  End of Models __________________
// __________ User Routes ___________________

//User Login Route
router.get('/login', (req, res) => {
  res.render('users/login');
});

//User Forgot password
router.get('/forgotPassword', (req, res) => {
  res.render('users/forgotPassword');
});
//Forgot Password Post
router.post('/forgot', (req, res) => {});
//Users Home
router.get('/home', ensureAuthenticated, (req, res) => {
  let id = req.user.subscribed;
  if (id === '') {
    res.render('users/home');
  }
  Show.findOne({
    _id: id
  }).then(show => {
    res.render('users/home', {
      show: show
    });
  });
});

//User Register Route
router.get('/register', (req, res) => {
  res.render('users/register');
});

//User Add kids
router.get('/kids', (req, res) => {
  res.render('users/kids');
});

//___________ End of user Routes _________
// ____________ User Process _____________
//_____________ Login Form _______________
//Login Form Post
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/users/home',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

//Register Form POST
router.post('/register', (req, res) => {
  let errors = [];
  let i;
  let kids = [];

  if (!req.body.name) {
    errors.push({ text: 'Please add your name' });
  }
  if (!req.body.email) {
    errors.push({ text: 'Please add your email' });
  }
  if (!req.body.phone) {
    errors.push({ text: 'Please add your cell phone number' });
  }
  if (!req.body.password) {
    errors.push({ text: 'Please add your password' });
  }
  if (!req.body.password2) {
    errors.push({ text: 'Please confirm your password' });
  }
  if (req.body.password != req.body.password2) {
    errors.push({ text: 'Passwords do not match' });
  }

  if (req.body.password.length < 6) {
    errors.push({ text: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    //Loop Through the kids to get the Manual Brute force
    let kids = [];
    if (req.body.childName1) {
      kids.push({ name: req.body.childName1 });
    }
    if (req.body.childName2) {
      kids.push({ name: req.body.childName2 });
    }
    if (req.body.childName3) {
      kids.push({ name: req.body.childName3 });
    }
    if (req.body.childName4) {
      kids.push({ name: req.body.childName4 });
    }
    if (req.body.childName5) {
      kids.push({ name: req.body.childName5 });
    }
    if (req.body.childName6) {
      kids.push({ name: req.body.childName6 });
    }
    if (req.body.childName7) {
      kids.push({ name: req.body.childName7 });
    }
    if (req.body.childName8) {
      kids.push({ name: req.body.childName8 });
    }
    if (req.body.childName9) {
      kids.push({ name: req.body.childName9 });
    }
    if (req.body.childName10) {
      kids.push({ name: req.body.childName10 });
    }
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        req.flash('error_msg', 'Email already registered');
        res.redirect('/users/register');
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          password: req.body.password,
          kidname: kids
        });
        //Salting password with bcrypt
        const saltRounds = 10;
        bcrypt.genSalt(saltRounds, function(err, salt) {
          bcrypt.hash(newUser.password, salt, function(err, hash) {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can now log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => {
                console.log(err);
                return;
              });
          });
        });
      }
    });
  }
});

//Logout User Process
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});
//_____________ kid Register Form _______________
//Register User Process Login
router.post('/register', (req, res) => {
  let errors = [];
  if (!req.body.name) {
    errors.push({ text: 'Please add your name' });
  }
  if (errors.length > 0) {
    res.render('users/register', {
      errors: errors,
      name: req.body.name
    });
  } else {
    User.findOne({ email: req.user.email }).then(user => {});
  }
});

module.exports = router;
