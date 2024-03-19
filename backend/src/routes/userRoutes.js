const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Login route
router.post('/login', (req, res) => {
    res.send("Login route")
});

// Register route
router.post('/register', (req, res) => {
    console.log(req.body)
    const user = new User(req.body);
    user.save().then((user) => {
        res.json(user);
    }).catch((err) => {
        res.status(400).json(err);
    });
});

module.exports = router;