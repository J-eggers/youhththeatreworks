const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated, adminAuthentication} = require('../helpers/auth');

//___________  Load Model  ___________
//Load Idea Model 
require('../models/Shows');
const Show = mongoose.model('shows');
const Cast = mongoose.model('cast');
require('../models/User');
const User = mongoose.model('users');
require('../models/Articles');
const Article = mongoose.model('articles');

// ________________________________


//_________ Get Admin Panel _______
router.get('/',ensureAuthenticated,adminAuthentication,  (req, res)=>{
    res.render('admin/index');   
});
//___________Get Shows Edit Page 
router.get('/shows',ensureAuthenticated,adminAuthentication,  (req, res)=>{
    Show.find({})
        .sort({showDate: 'desc'})
        .then(shows =>{
            res.render('admin/shows', {
                shows:shows
            });
        });
});
//__________ Get Shows to see Subscribed________
router.get('/subscribe',ensureAuthenticated,adminAuthentication,  (req, res)=>{
    Show.find({})
        .sort({showDate: 'desc'})
        .then(shows =>{
            res.render('admin/subscribe', {
                shows:shows
            });
        });
});
//__________Subscribe to event___________
router.put('/subscribe/:id', ensureAuthenticated, adminAuthentication, (req, res)=>{
    let subscribe = req.params.id;
    let id = req.user.id;
    User.updateOne({_id:id}, {$set: {subscribed: subscribe}}, {new:true}, (err,user)=>{
        if (err) return (err);
        req.flash('success_msg', 'Subscribed');
        res.redirect(`/admin`)
    });
});

//___________ Articles ____________
router.get('/newsletter', ensureAuthenticated,adminAuthentication,(req,res)=>{
    Article.find({})
        .sort({date: 'desc'})
        .then(article =>{
            res.render('admin/newsletter', {
                article:article
            });
        });
});
//___________ Articles ____________
router.get('/reminders', ensureAuthenticated,adminAuthentication,(req,res)=>{
    Show.find({})
        .sort({date: 'desc'})
        .then(shows =>{
            res.render('admin/reminder', {
                shows:shows
            });
        });
});
//_________Show Edit reminder form _____________
router.get('/reminderEdit/:id', ensureAuthenticated,adminAuthentication,(req,res)=>{
    Show.findOne({
        _id: req.params.id
    })
    .then(show =>{
        if(show){
            res.render('admin/reminderEdit', {
                show:show
            });
        } else {
            req.flash('error_msg', 'Show No longer exists');
            res.redirect('/admin/subscribe'); 
        }
    })
    
});
router.post('/reminder/:id', ensureAuthenticated,adminAuthentication,(req,res)=>{
    let idInput = {_id:req.params.id}
    let reminderInput = req.body.reminder
    Show.updateOne(idInput, {reminder : reminderInput },{new: true}, (err, show)=>{
        if (err) return (err);
        req.flash('success_msg', 'Reminder Added');
        res.redirect('/admin');
    });

});
//__________ Get Shows to see Cast_______
router.get('/castIndex',ensureAuthenticated,adminAuthentication,  (req, res)=>{
    Show.find({})
        .sort({showDate: 'desc'})
        .then(shows =>{
            res.render('admin/castIndex', {
                shows:shows
            });
        });
});
router.get('/cast/:id', ensureAuthenticated,adminAuthentication,(req,res)=>{
    Show.findOne({
        _id: req.params.id
    })
    .then(show =>{
        if(show){
            res.render('admin/cast', {
                show:show
            });
        } else {
            req.flash('error_msg', 'Show No longer exists');
            res.redirect('/admin/subscribe'); 
        }
       
    });
});

router.put
module.exports = router;