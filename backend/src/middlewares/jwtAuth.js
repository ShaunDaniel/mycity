
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const jwtAuth = (req, res, next) => {
    const token = req.cookies.jwtToken;
    if (!token) {
        console.log("No token found")
    }        
    else{
        try {   
            const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
            req.user = decoded;
            next();
        } catch (err) {
            console.error(err);
        }
    }

};


module.exports = jwtAuth;