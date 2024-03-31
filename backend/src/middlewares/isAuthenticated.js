function authenticateToken(req, res, next) {
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