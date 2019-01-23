const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const smtpTransport = require('../config/mailer');
const { ensureAuthenticated, adminAuthentication } = require('../helpers/auth');

//___________  Load Model  ___________
//Load Idea Model
require('../models/Shows');
const Show = mongoose.model('shows');
const Cast = mongoose.model('cast');
require('../models/User');
const User = mongoose.model('users');
require('../models/Articles');
const Article = mongoose.model('articles');
require('../models/ShowClips');
const ShowClips = mongoose.model('showClips');
require('../models/Quotes');
const Quote = mongoose.model('quote');

// ________________________________

//_________ Get Admin Panel _______
router.get('/', ensureAuthenticated, adminAuthentication, (req, res) => {
  res.render('admin/index');
});

//_________ Get Quote Submintion  _______
router.get('/quotes', ensureAuthenticated, adminAuthentication, (req, res) => {
  res.render('admin/quotes');
});
//___________Get Shows Edit Page
router.get('/shows', ensureAuthenticated, adminAuthentication, (req, res) => {
  Show.find({})
    .sort({ showDate: 'desc' })
    .then(shows => {
      res.render('admin/shows', {
        shows: shows
      });
    });
});
//__________ Get Shows to see Subscribed________
router.get(
  '/subscribe',
  ensureAuthenticated,
  adminAuthentication,
  (req, res) => {
    Show.find({})
      .sort({ showDate: 'desc' })
      .then(shows => {
        res.render('admin/subscribe', {
          shows: shows
        });
      });
  }
);
//__________Subscribe to event___________
router.put(
  '/subscribe/:id',
  ensureAuthenticated,
  adminAuthentication,
  (req, res) => {
    let subscribe = req.params.id;
    let id = req.user.id;
    User.updateOne(
      { _id: id },
      { $set: { subscribed: subscribe } },
      { new: true },
      (err, user) => {
        if (err) return err;
        req.flash('success_msg', 'Subscribed');
        res.redirect(`/admin`);
      }
    );
  }
);

//___________ Articles ____________
router.get(
  '/newsletter',
  ensureAuthenticated,
  adminAuthentication,
  (req, res) => {
    Article.find({})
      .sort({ date: 'desc' })
      .then(article => {
        res.render('admin/newsletter', {
          article: article
        });
      });
  }
);

//___________ Show Clips ____________
router.get(
  '/showClips',
  ensureAuthenticated,
  adminAuthentication,
  (req, res) => {
    ShowClips.find({})
      .sort({ date: 'desc' })
      .then(showClips => {
        res.render('admin/showClips', {
          showClips: showClips
        });
      });
  }
);
//___________ Articles ____________
router.get(
  '/reminders',
  ensureAuthenticated,
  adminAuthentication,
  (req, res) => {
    Show.find({})
      .sort({ date: 'desc' })
      .then(shows => {
        res.render('admin/reminder', {
          shows: shows
        });
      });
  }
);
//_________Show Edit reminder form _____________
router.get(
  '/reminderEdit/:id',
  ensureAuthenticated,
  adminAuthentication,
  (req, res) => {
    Show.findOne({
      _id: req.params.id
    }).then(show => {
      if (show) {
        res.render('admin/reminderEdit', {
          show: show
        });
      } else {
        req.flash('error_msg', 'Show No longer exists');
        res.redirect('/admin/subscribe');
      }
    });
  }
);
router.post(
  '/reminder/:id',
  ensureAuthenticated,
  adminAuthentication,
  (req, res) => {
    let idInput = { _id: req.params.id };
    let reminderInput = req.body.body;
    Show.updateOne(
      idInput,
      { reminder: reminderInput },
      { new: true },
      (err, show) => {
        if (err) return err;
        req.flash('success_msg', 'Reminder Added');
        res.redirect('/admin');
      }
    );
  }
);
//__________ Render Email_______
router.get('/email', ensureAuthenticated, adminAuthentication, (req, res) => {
  res.render('admin/email');
});
//Render Cast Email
router.get(
  '/email/:id',
  ensureAuthenticated,
  adminAuthentication,
  (req, res) => {
    Show.findOne({
      _id: req.params.id
    }).then(show => {
      if (show) {
        res.render('admin/email', {
          show: show
        });
      } else {
        req.flash('error_msg', 'Show No longer exists');
        res.redirect('/admin/subscribe');
      }
    });
  }
);
//Process Mass Email
router.post('/email', ensureAuthenticated, adminAuthentication, (req, res) => {
  let id = req.params.id;
  let errors = [];
  if (!req.body.body) {
    errors.push({ text: 'Please add your message' });
  }
  if (!req.body.subject) {
    errors.push({ text: 'Please add your subject' });
  }
  //Server side validation
  if (errors.length > 0) {
    res.render('admin/email', {
      show: show,
      errors: errors,
      subject: req.body.subject,
      email: req.body.body
    });
  } else {
    User.find({}).then(user => {
      if (user === null) {
        req.flash('error_msg', 'No users found with that email');
        res.redirect('/admin');
      } else {
        let mailOptions = {
          from: 'youththeatreworkscumc@gmail.com',
          to: 'placeholder',
          subject: req.body.subject,
          html: req.body.body
        };
        for (let i = 0; i < user.length; i++) {
          mailOptions.to = user[i].email;

          console.log(mailOptions);
          smtpTransport.sendMail(mailOptions, function(err, response) {
            if (err) {
              console.log('there was an error:', err);
            }
          });
        }
        res.render('users/sentEmail');
      }
    });
  }
});
//Process Cast Email
router.post(
  '/email/:id',
  ensureAuthenticated,
  adminAuthentication,
  (req, res) => {
    let id = req.params.id;
    let errors = [];
    if (!req.body.body) {
      errors.push({ text: 'Please add your message' });
    }
    if (!req.body.subject) {
      errors.push({ text: 'Please add your subject' });
    }
    //Server side validation
    if (errors.length > 0) {
      Show.findOne({
        _id: id
      }).then(show => {
        if (show) {
          res.render('admin/email', {
            show: show,
            errors: errors,
            subject: req.body.subject,
            email: req.body.body
          });
        }
      });
    } else {
      User.find({ subscribed: id }).then(user => {
        if (user === null) {
          req.flash('error_msg', 'No users found with that email');
          res.redirect('/admin');
        } else {
          let mailOptions = {
            from: 'youththeatreworkscumc@gmail.com',
            to: 'placeholder',
            subject: req.body.subject,
            html: req.body.body
          };
          for (let i = 0; i < user.length; i++) {
            mailOptions.to = user[i].email;

            console.log(mailOptions);
            smtpTransport.sendMail(mailOptions, function(err, response) {
              if (err) {
                console.log('there was an error:', err);
              }
            });
          }
          res.render('users/sentEmail');
        }
      });
    }
  }
);
//__________ Get Shows to see Cast_______
router.get(
  '/castIndex',
  ensureAuthenticated,
  adminAuthentication,
  (req, res) => {
    Show.find({})
      .sort({ showDate: 'desc' })
      .then(shows => {
        res.render('admin/castIndex', {
          shows: shows
        });
      });
  }
);
router.get(
  '/cast/:id',
  ensureAuthenticated,
  adminAuthentication,
  (req, res) => {
    Show.findOne({
      _id: req.params.id
    }).then(show => {
      if (show) {
        res.render('admin/cast', {
          show: show
        });
      } else {
        req.flash('error_msg', 'Show No longer exists');
        res.redirect('/admin/subscribe');
      }
    });
  }
);

//___________ Quote Submition Process ________
router.post('/quote', ensureAuthenticated, adminAuthentication, (req, res) => {
  let errors = [];

  if (!req.body.quote) {
    errors.push({ text: 'Please add a title' });
  }
  if (!req.body.person) {
    errors.push({ text: 'Please select a show date' });
  }
  if (errors.length > 0) {
    res.render('artilces/showClipAdd', {
      errors: errors,
      person: req.body.person,
      quote: req.body.quote
    });
  } else {
    const userAdmin = {
      quote: req.body.quote,
      person: req.body.person
    };
    new Quote(userAdmin).save().then(quote => {
      req.flash('success_msg', 'quote added');
      res.redirect('/admin');
    });
  }
});

module.exports = router;
