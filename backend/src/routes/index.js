var express = require('express');
var router = express.Router();

router.get('/user-details', function(req, res) {
  if (req.isAuthenticated()) {
    res.json(req.session.passport.user);
  } else {
    res.status(401).json({ message: 'User is not authenticated' });
  }
});

module.exports = router;