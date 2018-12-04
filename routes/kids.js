const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated, adminAuthentication} = require('../helpers/auth');

//___________ Load Models __________________

require('../models/User');
const User = mongoose.model('users');
//____________________________________________


router.get('/kidprofile/:id',ensureAuthenticated, (req, res)=>{
    let id = req.params.id
    User.findOne({
        "kidname._id": id
    })
    .then(kid=>{
        //making sure your rank is = to admin or the user is the parent 
        if(req.user.rank === "admin" || req.user.id === kid.id){
            res.render('kids/kidprofile', {
                parent:kid,
                kid:kid.kidname.id(id)
                
            })
        } else {
            req.flash('error_msg', 'Not Authorized')
            res.redirect('/users/login');
        }
        ;
    });
});
router.get('/kidEdit/:id',ensureAuthenticated, (req, res)=>{
    let id = req.params.id
    User.findOne({
        "kidname._id": id
    })
    .then(kid=>{
        //making sure your rank is = to admin or the user is the parent 
        if(req.user.rank === "admin" || req.user.id === kid.id){
            res.render('kids/kidEdit', {
                kid:kid.kidname.id(id)
                
            })
        } else {
            req.flash('error_msg', 'Not Authorized')
            res.redirect('/users/login');
        }
        ;
    });
});

router.put('/kidEdit/:id',ensureAuthenticated, (req, res)=>{
    
    let kidID = req.params.id;
    let kidname = req.body.name;
    let idInput;
    let allergies;
    let pants;
    let shirt;
    let experience;
    let age;

    if(req.body.allergies){
        allergies = req.body.allergies
    }
    if(req.body.age){
        age = req.body.age
    }
    if(req.body.pants){
        pants = req.body.pants
    }
    if(req.body.shirt){
        shirt = req.body.shirt
    }
    if(req.body.experience){
      experience = req.body.experience
    }
    User.findOne({
        "kidname._id": kidID,
        
    })
    .then(kid=>{
        idInput = {
            _id:kid.id, 
            "kidname._id":kidID
        }
        console.log(allergies);

        if(req.user.rank === "admin" || req.user.id === kid.id){
            User.updateOne(idInput, {$set:{
                   "kidname.$.allergies":allergies,
                    "kidname.$.sizes.pants":pants,
                    "kidname.$.sizes.shirt":shirt,
                    "kidname.$.age":age     
        
                }}, {new:true}, (err,user)=>{
                if (err) return (err);
            
            });
            req.flash('success_msg', 'Information updated');
            res.redirect(`/kids/kidprofile/${kidID}`);
            
        } else {
            req.flash('error_msg', 'Not Authorized')
                res.redirect('/users/login');
        }
    })
   
    
    

});
module.exports = router;