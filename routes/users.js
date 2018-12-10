const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();
const smtpTransport = require('../config/mailer');
const { ensureAuthenticated, adminAuthentication } = require('../helpers/auth');
const crypto = require('crypto');

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
router.get('/resetPassword/:token', (req, res) => {
  const token = req.params.token;
  User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  }).then(user => {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      res.redirect('/users/login');
    } else {
      res.render('users/resetPassword', {
        token: token
      });
    }
  });
});
//Forgot Password Post
router.post('/forgotPassword', (req, res) => {
  if (req.body.email === '') {
    req.flash('error_msg', 'make sure to enter an email');
    res.redirect('/users/forgotPassword');
  }
  User.findOne({ email: req.body.email }).then(user => {
    if (user === null) {
      req.flash('error_msg', 'No user found with that email');
      res.redirect('/users/forgotPassword');
    } else {
      const token = crypto.randomBytes(20).toString('hex');
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 360000;
      user.save();
      const mailOptions = {
        from: 'youththeatreworkscumc@gmail.com',
        to: `${user.email}`,
        subject: `Reset Password Link`,
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n Please click on the following link, or paste this into your browser to complete the process:\n\n http://${
          req.headers.host
        }/users/resetPassword/${token}\n\n If you did not request this, please ignore this email and your password will remain unchanged.\n`
      };

      smtpTransport.sendMail(mailOptions, function(err, response) {
        if (err) {
          console.log('there was an error:', err);
        } else {
          console.log('here is the res:', response);
          res.render('users/sentEmail');
        }
      });
    }
  });
});
//Reset password Post
router.post('/resetPassword/:token', (req, res) => {
  const token = req.params.token;
  const password = req.body.password1;
  if (password != req.body.password2) {
    req.flash('error', 'Passwords did not match');
    return res.redirect(`/users/resetPassword/${token}`);
  } else {
    User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    }).then(user => {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect(`/users/resetPassword/${token}`);
      } else {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        //Salt password
        const saltRounds = 10;
        bcrypt.genSalt(saltRounds, function(err, salt) {
          bcrypt.hash(password, salt, function(err, hash) {
            if (err) throw err;
            user.password = hash;
            user
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'Your password has been updated and you can now log in'
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
