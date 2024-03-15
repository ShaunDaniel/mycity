var express = require("express");
var passport = require("passport");
var GoogleStrategy = require("passport-google-oidc");
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
      User.findOne({ googleId: profile.id })
        .then((user) => {
          if (!user) {
            var newUser = new User({
              googleid: profile.id,
              first_name: profile.name.givenName,
              last_name: profile.name.familyName,
              email: profile.emails[0].value,
            });
            newUser
              .save()
              .then((savedUser) => cb(null, savedUser))
              .catch((err) => cb(err));
          } else {
            user.first_name = profile.name.givenName;
            user.last_name = profile.name.familyName;
            user.email = profile.emails[0].value;
            user
              .save()
              .then((updatedUser) => cb(null, updatedUser))
              .catch((err) => cb(err));
          }
        })
        .catch((err) => cb(err));
    }
  )
);

router.get("/login", function (req, res, next) {
  res.send("login");
});
router.get("/login/federated/google", passport.authenticate("google"));
router.get('/oauth2/redirect/google', passport.authenticate('google', {
    successRedirect: 'http://localhost:3000/',
    failureRedirect: 'http://localhost:3000/login'
  })
  );
  passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { id: user.id, username: user.username, name: user.name });
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });


module.exports = router;
