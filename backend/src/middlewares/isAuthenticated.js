function isAuthenticated(req, res, next) {
    if (req.user) {return next();}
}


module.exports = isAuthenticated;