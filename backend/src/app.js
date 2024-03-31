const express = require("express");
const path = require('path');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const User = require('./models/user');
const rateLimit = require("express-rate-limit");
const dotenv = require('dotenv').config();
const session = require('express-session');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const useGoogleStrategy = require('./config/passport.config.js');
// Routers
const userRouter = require("./routes/userRoutes");
const issueRouter = require("./routes/issueRoutes");
const authRouter = require('./routes/auth');
 
const app = express();
app.set('trust proxy', 1);
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {console.log(error)});


app.use(cookieParser());
const allowedOrigins = ['http://localhost:3000','https://mycity-backend.onrender.com/'];

app.use(cors({
    origin: function(origin, callback){
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1){
            console.log(origin);
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));
const port = process.env.PORT || 3001;

// Enable rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use("/", limiter); // Apply rate limiting middleware
app.use(helmet()); // Apply helmet middleware for security headers
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "validator.swagger.io"],
        childSrc: ["'none'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
    }
}));


app.use(logger('dev')); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 
app.use(express.static(path.join(__dirname, 'public'))); 

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

// Passport config
useGoogleStrategy();
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.use("/api/users",userRouter);
app.use("/issues", issueRouter);
app.use('/v1/auth', authRouter)



// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
