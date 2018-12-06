const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { ensureAuthenticated, adminAuthentication } = require('../helpers/auth');

//___________  Load Model  ___________
//Load Idea Model
require('../models/Shows');
const Show = mongoose.model('shows');
const Cast = mongoose.model('cast');
require('../models/User');
const User = mongoose.model('users');

// ________________________________

//___________ Routes for the Shows____________-
//Shows Index page (public)
router.get('/', ensureAuthenticated, (req, res) => {
  Show.find({})
    .sort({ showDate: 'desc' })
    .then(shows => {
      res.render('shows/index', {
        shows: shows
      });
    });
});
//_________ Routes for register fr show page ______________
//Shows Register page (public)
router.get('/register/:id', ensureAuthenticated, (req, res) => {
  Show.findByIdAndUpdate({
    _id: req.params.id
  }).then(show => {
    res.render('shows/register', {
      show: show
    });
  });
});
//Register kids page Action (add)
router.put('/register/:id', ensureAuthenticated, (req, res) => {
  let id = req.user.id;
  let subscribe = req.params.id;
  let kidname = req.body.kidname;
  let kidID = req.body.kidID;
  //Updating User kidname, and Subs
  if (req.body.kidID) {
    idInput = { _id: id, 'kidname.name': kidname };
    User.updateOne(
      idInput,
      { 'kidname.$.registered': true },
      { new: true },
      (err, user) => {
        if (err) return err;
        console.log('updated');
      }
    );
    //Updating User Subscribed
    //determine if user is registred
    User.updateOne(
      { _id: id },
      { $set: { subscribed: subscribe } },
      { new: true },
      (err, user) => {
        if (err) return err;
      }
    );
  }
  //Update the show with the new Cast
  Show.findOne({
    _id: subscribe
  }).then(show => {
    if (req.body.kidname) {
      //Creates a cast member out of input
      const newCast = new Cast({
        kidname: req.body.kidname,
        kidID: kidID,
        email: req.user.email,
        parentName: req.user.name,
        phone: req.user.phone
      });
      //Pushes the cast memeber on the show
      show.cast.push(newCast);

      show
        .save()

        .then(show => {
          console.log(show.id);
          req.flash('success_msg', 'Child added');
          res.redirect(`/shows/register/${show.id}`);
        });
    } else {
      req.flash('error_msg', 'Input Error');
      res.redirect(`/shows/register/${show._id}`);
    }
  });
});

//Un-register Kid Action
router.delete('/register/:id', ensureAuthenticated, (req, res) => {
  let id = req.user.id;
  let email = req.user.email;
  let unsubscribe = req.params.id;
  let kidname = req.body.kidname;
  let kidID = req.body.kidID;

  //Updating User kidname to false
  if (kidID) {
    idInput = { _id: id, 'kidname.name': kidname };
    User.updateOne(
      idInput,
      { 'kidname.$.registered': false },
      { new: true },
      (err, user) => {
        if (err) return err;
      }
    );
  }
  //Remove cast from
  let idInput2 = { _id: unsubscribe };
  Show.updateOne(
    idInput2,
    { $pull: { cast: { kidname: kidname, kidID: kidID } } },
    (err, user) => {
      if (err) return err;
    }
  );
  //redierect to show
  Show.findOne({
    _id: unsubscribe
  }).then(show => {
    req.flash('success_msg', 'Child removed');
    res.redirect(`/shows/register/${show.id}`);
  });
});

//_________ ADD SHOW Request ________________
// Add Show Form (admin only)
router.get('/addShow', ensureAuthenticated, adminAuthentication, (req, res) => {
  res.render('shows/addShow');
});
// Edit Show Form (admin only)
router.get(
  '/edit/:id',
  ensureAuthenticated,
  adminAuthentication,
  (req, res) => {
    Show.findOne({
      _id: req.params.id
    }).then(show => {
      res.render('shows/editShow', {
        show: show
      });
    });
  }
);

//__________________ Admin Only _____________________________________-
//Processes for the shows
//___________________ Creating a Show ___________________________
//Process Show Form
router.post('/', ensureAuthenticated, adminAuthentication, (req, res) => {
  //This upadates all users who are subscribed to a show to unsbscribed from all shows
  User.updateMany({ subscribed: '' }, (err, user) => {
    if (err) return err;
  });
  //Updates Each kid from being subscribed to a show, when a new show is posted. Making sure there is no errors
  User.updateMany(
    { 'kidname.registered': true },
    { $set: { 'kidname.$[].registered': false } },
    { multi: true },
    (err, user) => {
      if (err) return err;
    }
  );
  let errors = [];

  if (!req.body.title) {
    errors.push({ text: 'Please add a title' });
  }
  if (!req.body.showDate) {
    errors.push({ text: 'Please select a show date' });
  }
  if (!req.body.description) {
    errors.push({ text: 'Please add a show description' });
  }
  if (!req.body.rehearsal) {
    errors.push({ text: 'Please add a rehearsal dates' });
  }
  if (errors.length > 0) {
    res.render('shows/addShow', {
      errors: errors,
      title: req.body.title,
      showDate: req.body.showDate,
      description: req.body.description,
      rehearsal: req.body.rehearsal
    });
  } else {
    const userAdmin = {
      title: req.body.title,
      showDate: req.body.showDate,
      description: req.body.description,
      rehearsal: req.body.rehearsal
    };
    new Show(userAdmin).save().then(show => {
      User.updateMany(
        { rank: 'admin' },
        { subscribed: show._id },
        { new: true },
        (err, user) => {
          if (err) return err;
        }
      );
      req.flash('success_msg', 'Show added');
      res.redirect('/shows');
    });
  }
});
//Edit Form Process (shows)
router.put('/:id', ensureAuthenticated, adminAuthentication, (req, res) => {
  Show.findOne({
    _id: req.params.id
  }).then(show => {
    //new values
    show.title = req.body.title;
    show.showDate = req.body.showDate;
    show.description = req.body.description;
    show.rehearsal = req.body.rehearsal;

    show.save().then(show => {
      req.flash('success_msg', 'Show updated');
      res.redirect('/admin/shows');
    });
  });
});
//Delete Show
router.delete('/:id', ensureAuthenticated, adminAuthentication, (req, res) => {
  Show.deleteOne({ _id: req.params.id }).then(() => {
    req.flash('success_msg', 'Show removed');
    res.redirect('/shows');
  });
});

module.exports = router;
