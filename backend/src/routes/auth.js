var express = require("express");
var passport = require("passport");
var GoogleStrategy = require("passport-google-oidc");
const LocalStrategy = require("passport-local").Strategy;
var bcrypt = require("bcrypt");
var db = require("../config/db");
var logger = require('morgan');
const mongoose = require('mongoose');
const User = require('../models/user');
var session = require('express-session');
require('dotenv').config();

var router = express.Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/oauth2/redirect/google",
      scope: ["profile", "email"],
    },
    function verify(issuer, profile, cb) {
      User.findOne({ googleid: profile.id })
        .then((user) => {
          if (!user) {
            var newUser = new User({
              googleid: profile.id,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              email: profile.emails[0].value,
              state:"-",
              city:"-",
            });
            newUser
              .save()
              .then((savedUser) => cb(null, savedUser))
              .catch((err) => cb(err));
          } else {
            cb(null, user);
          }
        })
        .catch((err) => cb(err));
    }
  )
);

passport.use(new LocalStrategy({usernameField: 'username', passwordField: 'password'},
  async function(username, password, done) {
    try {
      const user = await User.findOne({ email: username });
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      } else {
        bcrypt.compare(password, user.password, function(err, result) {
            if (err) {
            console.log("Error occurred during password comparison");
            return done(err);
            }
          if (result === false) {
            return done(null, false);
          } else {
            console.log("User authenticated");
            return done(null, user);
          }
        });
      }
    } catch (err) {
      return done(err);
    }
  }
));


router.get("/login", function (req, res, next) {
  res.send("login");
});
router.get("/login/federated/google", passport.authenticate("google"));
router.get('/oauth2/redirect/google', passport.authenticate('google', {
  failureRedirect: 'http://localhost:3000/login'
}), (req, res) => {
  // Set a session variable to indicate login via Google
  req.session.loginMethod = 'Google';
  console.log(req.user)
  res.redirect('http://localhost:3000/');
}  
);


  module.exports = router;
