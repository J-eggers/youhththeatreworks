const mongoose = require('mongoose');

//Load user Model 
require('../models/User');
const User = mongoose.model('users');

//Load confin file
//Admin info 
const Admin = require('../config/admin');


module.exports = {
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()){
            return next(); 
        }

        req.flash('error_msg', 'Not Authorized');
        res.redirect('/users/login');
    },
    adminAuthentication: function(req, res, next){ 
        if(JSON.stringify(Admin.id) === JSON.stringify(req.user.id)){
            if(!req.user.rank){
                User.updateOne({_id:req.user.id}, {rank:"admin"}, {new: true}, (err, user)=>{
                    if (err) return (err);
                });
            }
            return next();
        }if(JSON.stringify(Admin.id2) === JSON.stringify(req.user.id)){
            if(!req.user.rank){
                User.updateOne({_id:req.user.id}, {rank:"admin"}, {new: true}, (err, user)=>{
                if (err) return (err);
                });
            }
            
            return next();
        }if(JSON.stringify(Admin.id3) === JSON.stringify(req.user.id)){
            if(!req.user.rank){
                User.updateOne({_id:req.user.id}, {rank:"admin"}, {new: true}, (err, user)=>{
                if (err) return (err);
                });
            }
            
            return next();
        }
        if(JSON.stringify(Admin.id4) === JSON.stringify(req.user.id)){
            if(!req.user.rank){
                User.updateOne({_id:req.user.id}, {rank:"admin"}, {new: true}, (err, user)=>{
                if (err) return (err);
                });
            }
            
            return next();
        }
        if(JSON.stringify(Admin.id5) === JSON.stringify(req.user.id)){
            if(!req.user.rank){
                User.updateOne({_id:req.user.id}, {rank:"admin"}, {new: true}, (err, user)=>{
                if (err) return (err);
                });
            }
            
            return next();
        }
        if(JSON.stringify(Admin.id6) === JSON.stringify(req.user.id)){
            if(!req.user.rank){
                User.updateOne({_id:req.user.id}, {rank:"admin"}, {new: true}, (err, user)=>{
                if (err) return (err);
                });
            }
            
            return next();
        }
        else {

            req.flash('error_msg', 'Not Authorized');
            res.redirect('/users/login'); 
        }
    } 

        
        
        
        
}