require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const ejs = require("ejs");
const bodyParser = require('body-parser');
// const encrypt = require("mongoose-encryption");         //for encryption using defined secret sentence
// const md5 = require("md5");                            //for hashing only
// const bcrypt = require("bcrypt");
// const saltRounds = 10;
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require("mongoose-findorcreate")

const app = express();
// const port = 8000;
const port = process.env.PORT || 8000;


app.use('/static', express.static('static')) //For serving static file
app.use(express.urlencoded())
app.set('view engine', 'ejs') 
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// mongoose.connect('mongodb://localhost/userData', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect('mongodb+srv://Ayush:Ayush1234@cluster0.ime0q.mongodb.net/Portfolio_User?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String
});

var contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    issue: String
});


userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema)
var Contact = mongoose.model('Contact', contactSchema);

passport.use(User.createStrategy());

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "https://ayushpersonal.herokuapp.com/auth/google/secrets",
    // callbackURL: "http://localhost:8000/auth/google/secrets",
    // userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
      console.log(profile.displayName)
    User.findOrCreate({ googleId: profile.id, username: profile.displayName }, function (err, user) {
      return cb(err, user);
    });
  }
));


app.get('/', (req, res) => {
    res.status(200).render('home');
});

app.post('/contact', (req, res) => {
    const myData = new Contact({
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        issue: req.body.issue
    });
    // var myData = new Contact(req.body);
    myData.save().then(() => {
        res.render("home")
        // res.send("This item has been saved to the Database")
    }).catch(() => {
        res.status(400).send("Item not saved to the Database")
    });
});

app.get('/calculator', (req, res) => {
    if (req.isAuthenticated()){
        res.status(200).render('calculator');
    } else{
        res.redirect("/login")
    }
});
app.get('/game', (req, res) => {
    if (req.isAuthenticated()){
        res.status(200).render('game');
    } else{
        res.redirect("/login")
    }
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ["profile"] })
  );

app.get("/auth/google/secrets", 
passport.authenticate('google', { failureRedirect: '/login' }),
function(req, res) {
// Successful authentication, redirect secrets page.
res.status(200).redirect('/home');
});


app.get('/login', (req, res) => {
    res.status(200).render('login');
});
app.get('/register', (req, res) => {
    res.status(200).render('register');
});

app.get('/home', (req, res) => {
    if (req.isAuthenticated()){
        res.status(200).render('login_home');
    } else{
        res.redirect("/login")
    }
});

app.get('/logout', (req, res) => {
    req.logout();
    res.status(200).redirect('/');
});

app.post('/register', (req, res) => {

    User.register({username: req.body.username}, req.body.password, function(err, user) {
        if(err){
            console.log(err)
            res.redirect("/register");
        } else{
            passport.authenticate("local")(req, res, function() {
                res.redirect("/home");
            });
        }
    });
    // bcrypt.hash(req.body.password, saltRounds, function(err, hash) {

    //     const newUser = new User({
    //         email: req.body.username,
    //         password: hash
    //     });
    //     newUser.save(function(err) {
    //         if (err) {
    //             console.log(err);
    //         } else{
    //             res.render("secrets")
    //         }       
    //     });
    // });

});

app.post('/login', (req, res) => {

        const user = new User({
            username: req.body.username,
            password: req.body.password
        });

        req.login(user, function(err){
            if(err) {
                console.log(err);
                res.redirect("/login");
            } else{
                passport.authenticate("local")(req, res, function(){
                    res.redirect("/home");
                });
            }
        });





    // const username = req.body.username;
    // // const password = md5(req.body.password);
    // const password = req.body.password;

    // User.findOne({email: username}, function (err, foundUser) {
    //     if(err) {
    //         console.log(err)
    //     } else{
    //         if (foundUser){
    //             bcrypt.compare(password, foundUser.password, function(err, result) {
    //                 if (result === true){
    //                     res.render("secrets")
    //                 }
    //             });
                   
    //         }
    //     }
    // });
});

// Starting Server
app.listen(port, () => {
    console.log(`The application started succesfully on port ${port}`)
});