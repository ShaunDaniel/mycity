const express = require("express");
const User = require("../models/user");
const cities = require("../../data/state_city_data.json");
const bcrypt = require("bcrypt");
const passport = require("passport");
const isAuthenticated = require("../middlewares/isAuthenticated");
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post("/user-details", (req, res) => {
  console.log("Inside user-details");
  console.log(req.body);  
  if(req.body.jwtToken){
    const decoded = jwt.verify(req.body.jwtToken, process.env.JWT_SECRET || '');
    res.json(decoded);
  } else {
    res.status(404).json({ message: "User not found" });
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
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ email: username });
    console.log("Inside login");
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      console.log(isMatch);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }
      else{
        const payload = {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                city: user.city,
                state_name: user.state_name,
                googleId: user.googleId,                
            },
          };
          jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 3600 }, // token expires in 1 hour
            (err, token) => {
              if (err) throw err;
              res.json({ token });
            }
          );

      }


    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Register route
router.post("/register", (req, res) => {
  console.log("Inside register");

  User.findOne({ email: req.body.email }).then((user) => {
    console.log("Checking user",user)
    if (user) {
      User.updateOne({ email: req.body.email,city: req.body.city,state_name:req.body.state_name }, { $set: req.body })
        .then((user) => {
          console.log("User updated successfully");
          console.log(user)
          res.status(201).send(req.body);
        })
        .catch((err) => {
          res.status(400).json(err);
        });
      return;
    } else {
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
      console.log("Checking google account",user)
      if (user.googleId) {
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
