const express = require("express");
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const SQLiteStore = require('connect-sqlite3')(session);
const logger = require('morgan');
const passport = require('passport');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const User = require('./models/user');
const rateLimit = require("express-rate-limit");
const dotenv = require('dotenv').config();

// Routers
const userRouter = require("./routes/userRoutes");
const issueRouter = require("./routes/issueRoutes");
const authRouter = require('./routes/auth');



const app = express();
const port = 3001;

// Enable rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

// Enable CSRF protection in production environment
if (process.env.NODE_ENV !== 'development') {
    app.use(csurf());
}

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
app.use(cors({ credentials: true, origin: 'http://localhost:3000',methods: 'GET,HEAD,PUT,PATCH,POST,DELETE' })); 
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL })
}));
app.use(passport.initialize()); 
app.use(passport.session());

// Passport serialization and deserialization
passport.serializeUser(async function(user, cb) {
    cb(null, user._id.toString())
});

passport.deserializeUser(async function(id, cb) {
    try {
        const user = await User.findById(id);
        cb(null, user);
    } catch (err) {
        cb(err);
    }
});

// Routes
app.use("/api/users", userRouter);
app.use("/issues", issueRouter);
app.use("/", authRouter);
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
