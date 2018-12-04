const express = require('express');
const path = require('path');
const keys = require('./config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const exphbs  = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const helmet = require('helmet');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const transporter = require('./config/mailer');

const app = express();

//____________  load Routes ____________
const shows = require('./routes/shows');
const users = require('./routes/users');
const kids = require('./routes/kids');
const articles = require('./routes/articles');
const admin = require('./routes/admin');
const tickets = require('./routes/tickets');

//____________  Load config file ________
//Passport Config
require('./config/passport')(passport);

//DB config
const db = require('./config/database');


//Conntect to mongoose  (database)
mongoose.connect(db.mongoURI, {
    useNewUrlParser: true
})
    .then(()=> console.log('MongoDB Connnected...'))
    .catch(err => console.log(err));

//______________    Load Model  ______________
require('./models/Tickets');
const ModelsTicket = mongoose.model('modelsTicket');


// _____________    MIDDLEWARE  ______________
//Install Helmet - HTTP security 
app.use(helmet());

//Handebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Static folder 
app.use(express.static(path.join(__dirname, 'public' )));
//Method Override middleware
app.use(methodOverride('_method'));

//Express Session 
app.use(session({
    secret: 'secret',
    store: new MongoStore({
        url:db.mongoURI,
    }),
    resave: true,
    saveUninitialized: true,
  }));
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//middleWare for flash
app.use(flash());

//Global Variables 
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user= req.user || null; 
    next();
});

// ________________ End of MIDDLEWARE ________________
// ________________ ROUTES _______________
//Index Route
app.get('/', (req, res)=>{
    const title = 'Youth Theatre';
    ModelsTicket.findOne({
        published: true
    })
    .then(modelsTicket=>{
        if(modelsTicket){
            res.render('index', {
                title: title,
                modelsTicket:modelsTicket
            });
        } else {
            res.render('index', {
                title: title
            });
        }
    });
});

//About Route 
app.get('/about', (req, res)=>{
    res.render('about');
});

app.post('/mailer', (req, res)=>{
    const mailOptions={
        from: 'youththeatreworkscumc@gmail.com',
        to: 'youththeatreworkscumc@gmail.com',
        subject:'"Contact Us" from the website',
        html: `<h3>From : ${req.body.name}</h3><h4>Response Email: ${req.body.email}<h4><br><hr>Body:<br><p>${req.body.text}</p>`

    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
        req.flash('success_msg', 'Email sent');
          console.log('Email sent: ' + info.response);
          res.render('users/sentEmail');
        }
      }); 

});




//______________ END OF ROUTES ______________
//use Routes
app.use('/shows', shows);
app.use('/users', users);
app.use('/articles', articles);
app.use('/admin', admin);
app.use('/tickets', tickets);
app.use('/kids', kids);


const port = process.env.PORT || 5000;

app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
});