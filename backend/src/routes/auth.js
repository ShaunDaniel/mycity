const express = require('express');
const Router = require('express').Router;
const passport = require('passport');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

var authRouter = express.Router();

authRouter.get('/google',passport.authenticate('google', { scope: ['profile', 'email'] }));

authRouter.get('/google/callback',passport.authenticate('google', { failureRedirect: '/login' }),(req,res) => {
    const token = jwt.sign(
      { user: req.user },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
  }
);



authRouter.get('/logout',(req,res,next) => {
    req.logout(function (err) {
      if (err) return next(err);
      res.redirect('/');
    });
  }
);

module.exports = authRouter;