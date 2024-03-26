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
      callbackURL: "/api/oauth2/redirect/google",
      scope: ["profile", "email"],
    },
    function verify(issuer, profile, done) {
      User.findOne({ email: profile.emails[0].value })
        .then((user) => {
          if (user) {
            user.googleid = profile.id;
            user.save()
              .then((updatedUser) => done(null, updatedUser))
              .catch((err) => done(err));
          } else {
            // Create a new user
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
              .then((savedUser) => done(null, savedUser))
              .catch((err) => done(err));
          }
        })
        .catch((err) => done(err));
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
router.get('/api/oauth2/redirect/google', passport.authenticate('google', {
  failureRedirect: process.env.FRONTEND_URL+'/login'
}), (req, res) => {
   
  res.redirect(process.env.FRONTEND_URL);
}  
);


  module.exports = router;
