const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { ensureAuthenticated, adminAuthentication } = require('../helpers/auth');

//___________  Load Model  ___________
//Load Idea Model
require('../models/ShowClips');
const ShowClips = mongoose.model('showClips');

// ________________________________

//___________ Routes for the Shows____________-
//Shows Index page (public)
router.get('/', (req, res) => {
  ShowClips.find({})
    .sort({ date: 'desc' })
    .then(showClips => {
      res.render('articles/showClips', {
        showClips: showClips
      });
    });
});

// Add Article Form (admin only)
router.get('/Add', ensureAuthenticated, adminAuthentication, (req, res) => {
  res.render('articles/showClipsAdd');
});
// Edit Article Form (admin only)
router.get(
  '/edit/:id',
  ensureAuthenticated,
  adminAuthentication,
  (req, res) => {
    ShowClips.findOne({
      _id: req.params.id
    }).then(showClips => {
      res.render('articles/showClipEdit', {
        showClips: showClips
      });
    });
  }
);

//Processes for the shows

//Process Article Form
router.post('/', ensureAuthenticated, adminAuthentication, (req, res) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({ text: 'Please add a title' });
  }
  if (!req.body.body) {
    errors.push({ text: 'Please select a show date' });
  }
  if (errors.length > 0) {
    res.render('artilces/showClipAdd', {
      errors: errors,
      title: req.body.title,
      body: req.body.body
    });
  } else {
    const userAdmin = {
      title: req.body.title,
      body: req.body.body
    };

    new ShowClips(userAdmin).save().then(showClips => {
      req.flash('success_msg', 'Show Clip added');
      res.redirect('/admin/showClips');
    });
  }
});

//Edit Form Process (shows)
router.put('/:id', ensureAuthenticated, adminAuthentication, (req, res) => {
  Article.findOne({
    _id: req.params.id
  }).then(article => {
    //new values
    article.title = req.body.title;
    article.body = req.body.body;

    article.save().then(article => {
      req.flash('success_msg', 'Article updated');
      res.redirect('/admin/newsletter');
    });
  });
});
//Delete Article
router.delete('/:id', ensureAuthenticated, adminAuthentication, (req, res) => {
  ShowClips.deleteOne({ _id: req.params.id }).then(() => {
    req.flash('success_msg', 'Show Clip removed');
    res.redirect('/admin/showClips');
  });
});

module.exports = router;
