const express = require('express');

const router = express.Router();

// Login route
router.post('/login', (req, res) => {
    res.send("Login route")
});

// Register route
router.post('/register', (req, res) => {
    // Handle register logic here
});

module.exports = router;