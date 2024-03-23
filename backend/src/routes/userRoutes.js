const express = require("express");
const User = require("../models/user");
const cities = require("../../data/state_city_data.json");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const isAuthenticated = require('../middlewares/isAuthenticated');
const router = express.Router();

router.get("/user-details", isAuthenticated, (req, res) => {
    if(isAuthenticated){
        if (req.user) {
            res.json(req.user);
        } 
    }
   else {
        res.status(404).json({ message: 'User not found' });
    }
});



router.get("/email-exists/:email", (req, res) => {
    const { email } = req.params;
    User.findOne({ email })
        .then((user) => {
            res.json({ exists: Boolean(user) });
        })
        .catch((err) => {
            res.status(400).json(err);
        });
});

// Login route
router.post('/login', passport.authenticate('local'), (req, res) => {
    if(req.user){
        res.status(200).json({'_id':req.user.id,'firstName':req.user.firstName,'lastName':req.user.lastName,'email':req.user.email,'city':req.user.city,'state':req.user.state});
    }
    else{
        res.status(401).json({message:'Invalid credentials'});
    }
});

router.get('/logout', (req, res,next) => {
    req.logout((err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to log out' });
        }
        req.session = null;
        res.clearCookie('connect.sid');
        res.send({
          message: 'Logged out',
        })
      });
});

// Register route
router.post("/register", (req, res) => {
    User.findOne({ email:req.body.email }).then((user) => {
        if (user) {
            User.updateOne({ email: req.body.email }, { $set: req.body }).then((user) => {
                console.log("User updated successfully")
                res.status(200).send(req.body);
            }).catch((err) => {
                res.status(400).json(err);
            });
            return;
        }
        else{
            const user = new User(req.body);
            user
                .save()
                .then((user) => {
                    res.status(201).send(user);
                })
                .catch((err) => {
                    res.status(400).json(err);
                });
        }

    });
    
});


router.get("/cities", (req, res) => {
    res.json(cities);
});

router.get("/google-account/:email", (req, res) => {
    User.findOne({ email: req.params.email })
        .then((user) => {
            if (user.googleid) {
                res.json({ exists: true });
            } else {
                res.json({ exists: false });
            }
        })
        .catch((err) => {
            res.status(400).json(err);
        });
});

module.exports = router;
