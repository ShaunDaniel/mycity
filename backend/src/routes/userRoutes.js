const express = require("express");
const User = require("../models/user");
const cities = require("../../data/state_city_data.json");
const bcrypt = require("bcrypt");
const passport = require("passport");
const isAuthenticated = require("../middlewares/isAuthenticated");
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get("/user-details", (req, res) => {
  console.log("Inside user-details");
  const authHeader = req.headers['authorization'];
  console.log(authHeader)
  if (authHeader) {
    console.log("Inside authHeader"  )
    const token = authHeader.split(' ')[1]; // Bearer <token>
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).json({ message: "Invalid token" });
      } else {
        console.log(decoded);
        res.json(decoded);
      }
    });
  } else {
    res.status(401).json({ message: "Token not found" });
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
          jwt.sign(payload,process.env.JWT_SECRET,{ expiresIn: 3600 }, 
            (err, token) => {
              if (err) throw err;
              res.status(200).json({jwtToken: `Bearer ${token}`});
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
  console.log(req.body);
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      if(user.googleId){
        User.updateOne({ email: req.body.email }, req.body).then((user) => {
          const token = jwt.sign(
            { user: req.body },
            process.env.JWT_SECRET,
            { expiresIn: "1h" },
          );
          res.status(201).json({jwtToken: `Bearer ${token}`});
        }
        ).catch((err) => {
          res.status(400).json(err);
        });
      }
      else{
        res.status(400).json({ message: "User already exists" });
      }
    } else {
      const user = new User(req.body);
      user
        .save()
        .then((user) => {
          console.log("Google User Registered for the first time",user)
          const token = jwt.sign(
            { user: user },
            process.env.JWT_SECRET,
            { expiresIn: "1h" },
          );
          res.status(201).json({jwtToken: `Bearer ${token}`});function authenticateToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Verify the token
    jwt.verify(bearerToken, process.env.JWT_SECRET, (err, authData) => {
      if(err) {
        res.sendStatus(403);
      } else {
        // If verification is successful, attach the user data to the request
        req.user = authData;
        next();
      }
    });
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}
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

router.get("/:userId/votes" , (req, res) => {
  User.findById(req.params.userId)
  .then((user) => {
    res.json(user.votes);
  })
  .catch((err) => {
    res.status(400).json(err);
  });
});

router.put('/:id/upvotes', async (req, res) => {
  const userId = req.params.id;
  const postId = req.body.postId;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { upvotedPosts: postId } },
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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
