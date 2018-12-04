const express = require('express');
const mongoose = require('mongoose');
const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const router = express.Router();
const {ensureAuthenticated, adminAuthentication} = require('../helpers/auth');


//___________  Load Model  ___________
//Load Idea Model 
require('../models/Tickets');
const Ticket = mongoose.model('ticket');
const ModelsTicket = mongoose.model('modelsTicket');
const Order = mongoose.model('order');
require('../models/User');
const User = mongoose.model('users');

// ________________________________
//___________________ Client Side _____________
//Client side purchase through stripe
router.post('/purchase', (req, res)=>{
    //check and validate information was filled in
    let errors = [];
    let name = req.body.name;
    let email = req.body.email;
    let phone = req.body.phone;

    if(!req.body.name){
        errors.push({text:'Please add your name'}); 
    }
    if(!req.body.email){
        errors.push({text:'Please add your email'}); 
    }
    if(!req.body.phone){
        errors.push({text:'Please add your cell phone number'}); 
    }
    if(errors.length > 0){
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email
        });
    } else {
        
        const userTicketOrder = {
            name:name,
            email:email,
            adultTicket:req.session.order.adult,
            childTicket:req.session.order.child
        }

        const newTicket = new Ticket(userTicketOrder);
        ModelsTicket.findOne({
            published: true
        })
        .then(modelsTicket=>{
            modelsTicket.ticket.push(newTicket);
            modelsTicket.save();
            const amount = req.session.order.amount;


            stripe.customers.create({
                email: req.body.stripeEmail,
                source: req.body.stripeToken
            })
            .then(customer => stripe.charges.create({
                amount:amount, 
                description: 'YTW  Ticket',
                currency:'usd',
                customer: customer.id,

            }))
            .then(charge => res.render('tickets/success'));
            
        })



        
    }
});
 router.post('/order', (req, res)=>{
    let errors = [];
    let child = req.body.childTickets
    let adult = req.body.adultTickets
    const re = /^[0-9]{0,2}$/;

    if(!adult){
         adult = 0; 
    }
    if(!child){
        child = 0; 
    }
    if(!re.test(child)){
        errors.push({text:'Please enter only numbers into youth ticket  field'}); 
    }
    if(!re.test(adult)){
        errors.push({text:'Please enter only numbers into adult ticket field'}); 
    }
    if(errors.length > 0 ){
        res.render('tickets/cart',{
            errors: errors,
            childTickets: req.body.childTickets,
            adultTickets: req.body.adultTickets,
        });
    } else {
        let amount;
        let adultCost;
        let childCost;
        let adultPrice;
        let childPrice;
        let viewPrice;
        ModelsTicket.findOne({})
        .then(modelsTicket=>{
            adultPrice = modelsTicket.cost.adult;
            childPrice = modelsTicket.cost.child;
            adultCost = adultPrice * adult;
            childCost = childPrice * child;
            viewPrice = adultCost + childCost;
            amount = viewPrice *100;

            const order = new Order({
                adult: adult, 
                child : child,
                amount: amount
            });
            req.session.order = order;
            res.render('tickets/order', {
                amount:amount,
                adult:adult, 
                child :child,
                viewPrice:viewPrice,
                adultPrice: adultPrice,
                childPrice:childPrice,
                adultCost:adultCost,
                childCost:childCost,
                stripePublishableKey: keys.stripePublishableKey
                
            });


        })
        
    }

 })
 //Client Side ordering page
 router.get('/order', (req, res)=>{
    res.render('tickets/order');
 });

 //____________________ Admin Panel _____________________________
//Admin side geting the create page 
 router.get('/create',ensureAuthenticated, adminAuthentication, (req, res)=>{
    res.render('tickets/create');
 });
// Render Edit Ticket
router.get('/edit/:id',ensureAuthenticated, adminAuthentication, (req, res)=>{
    ModelsTicket.findOne({
        _id: req.params.id
    })
    .then(modelsTicket=>{
        if(modelsTicket){
            res.render('tickets/edit',{
                modelsTicket:modelsTicket
            });
        } else {
            res.send('did not find ticket');
        }
        
        
    })
});
 //Admin post create ticket
 router.post('/',ensureAuthenticated, adminAuthentication, (req, res)=>{
    //This upadates all tickets to unpublished 
    ModelsTicket.updateMany( {published: false}, (err,user)=>{
        if (err) return (err);
      
        
    });
    
    let errors = [];
    let title = req.body.title
    let showDate = req.body.showDate
    let child = req.body.childCost
    let adult = req.body.adultCost
    const re = /^[0-9]{0,2}$/;

    if(!adult){
        errors.push({text:'Please add a title'}); 
    }
    if(!child){
        errors.push({text:'Please select a show date'}); 
    }
    if(!re.test(child)){
        errors.push({text:'Please enter only numbers into youth ticket  field'}); 
    }
    if(!re.test(adult)){
        errors.push({text:'Please enter only numbers into adult ticket field'}); 
    }
    if(errors.length > 0 ){
        res.render('/cart',{
            errors: errors,
            title:title,
            showDate:showDate,
            child:child,
            adult:adult
        });

    } else {
        const newTicket={
            title:title,
            showDate:showDate,
            cost:{
                child:child,
                adult:adult
            }
        }
        new ModelsTicket(newTicket)
        .save()
        .then(modelsTicket=>{
            req.flash('success_msg', 'Ticekts on Sale');
            res.redirect('/tickets/index');
        }); 

    }
 });
// Render Edit Ticket
router.put('/:id',ensureAuthenticated, adminAuthentication, (req, res)=>{
    let id = req.params.id;
    let errors = [];
    let title = req.body.title
    let showDate = req.body.showDate
    let child = req.body.childCost
    let adult = req.body.adultCost
    const re = /^[0-9]{0,2}$/;

    if(!adult){
        errors.push({text:'Please add a title'}); 
    }
    if(!child){
        errors.push({text:'Please select a show date'}); 
    }
    if(!re.test(child)){
        errors.push({text:'Please enter only numbers into youth ticket  field'}); 
    }
    if(!re.test(adult)){
        errors.push({text:'Please enter only numbers into adult ticket field'}); 
    }
    if(errors.length > 0 ){
        res.render('/cart',{
            errors: errors,
            title:title,
            showDate:showDate,
            child:child,
            adult:adult
        });

    } else {
        ModelsTicket.findOne({
            _id:id
        })
        .then(modelsTicket=>{
            modelsTicket.title= title;
            modelsTicket.showDate= showDate;
            modelsTicket.cost.adult = adult;
            modelsTicket.cost.child = child;
           
            //Save NEW ticket
            modelsTicket.save()
            .then(modelsTicket=>{
                req.flash('success_msg', `${modelsTicket.title} updated`);
                res.redirect('/tickets/index');
            }); 
        });
    }
});

 //Client Side Success Page 
 router.get('/success', (req, res)=>{
    res.render('tickets/success');
});


//ADmin side tickets index page
 router.get('/index',ensureAuthenticated, adminAuthentication, (req, res)=>{
    ModelsTicket.find({})
    .sort({showDate: 'desc'})
    .then(modelsTicket =>{
        res.render('tickets/index', {
            modelsTicket:modelsTicket
        });
    });
 });
 //cals the guest list for the ticekets
 router.get('/guestlist/:id',ensureAuthenticated, adminAuthentication,(req, res)=>{
    ModelsTicket.findOne({
        _id: req.params.id
    })
    .then(modelsTicket=>{
        res.render('tickets/guestlist', {
            modelsTicket:modelsTicket
        });
    })
});
//stop selling ticket 
router.get('/stopticket',ensureAuthenticated, adminAuthentication,(req, res)=>{
    ModelsTicket.findOne({
        published: true
    })
    .then(modelsTicket=>{
        if(modelsTicket){
            modelsTicket.published = false
            modelsTicket.save()
            .then((modelsTicket)=>{
                req.flash('success_msg', `${modelsTicket.title} is no longer on sale`);
                res.redirect('/tickets/index');
            });
        } else {
            req.flash('error_msg', 'Tickets are already no longer on sale');
            console.log('error occured when trying to stop the sell of tickets')
            res.redirect('/tickets/index');
        }
       
    })
});
//is to publish tickets to sell 
router.get('/sellticket/:id',ensureAuthenticated, adminAuthentication,(req, res)=>{
    //if another ticket is on sale this sets that publised to false
    ModelsTicket.findOne({
        published: true
    })
    .then(modelsTicket=>{
        if(modelsTicket){
            modelsTicket.published = false
            modelsTicket.save();
        } else {

        }
    });
    //this finds the new ticket and puts it on sale
    ModelsTicket.findOne({
        _id:  req.params.id
    })
    .then(modelsTicket=>{
        if(modelsTicket){
            modelsTicket.published = true
            modelsTicket.save()
            .then((modelsTicket)=>{
                req.flash('success_msg', `${modelsTicket.title} is now on sale`);
                res.redirect('/tickets/index');
            });
        } else {
            req.flash('error_msg', 'Error occurred');
            res.redirect('/tickets/index');
        }
       
    })
});


//Deletes ticket
router.delete('/:id',ensureAuthenticated, adminAuthentication,(req, res)=>{
    ModelsTicket.deleteOne({_id: req.params.id})
    .then(()=>{
        req.flash('success_msg', 'Ticeket deleted')
        res.redirect('/tickets/index');
    });
});




module.exports = router; 