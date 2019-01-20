const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { ensureAuthenticated, adminAuthentication } = require('../helpers/auth');

//___________  Load Model  ___________
//Load Idea Model
require('../models/Articles');
const Article = mongoose.model('articles');

// ________________________________

//___________ Routes for the Shows____________-
//Shows Index page (public)
router.get('/', (req, res) => {
  Article.find({})
    .sort({ date: 'desc' })
    .then(articles => {
      res.render('articles/index', {
        articles: articles
      });
    });
});

// Add Article Form (admin only)
router.get(
  '/addArticle',
  ensureAuthenticated,
  adminAuthentication,
  (req, res) => {
    res.render('articles/addArticle');
  }
);
// Edit Article Form (admin only)
router.get(
  '/editArticle/:id',
  ensureAuthenticated,
  adminAuthentication,
  (req, res) => {
    Article.findOne({
      _id: req.params.id
    }).then(article => {
      res.render('articles/editArticle', {
        article: article
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
    res.render('articles/addArticle', {
      errors: errors,
      title: req.body.title,
      body: req.body.body
    });
  } else {
    const userAdmin = {
      title: req.body.title,
      body: req.body.body
    };
    new Article(userAdmin).save().then(article => {
      req.flash('success_msg', 'Article added');
      res.redirect('/admin/newsletter');
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
  Article.deleteOne({ _id: req.params.id }).then(() => {
    req.flash('success_msg', 'Article removed');
    res.redirect('/shows');
  });
});

module.exports = router;
