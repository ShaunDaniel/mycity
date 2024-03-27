const express = require("express");
const path = require('path');
const cookieSession = require('cookie-session');
const MongoStore = require('connect-mongo');
const logger = require('morgan');
const passport = require('passport');
const cors = require('cors');
const helmet = require('helmet');
const User = require('./models/user');
const rateLimit = require("express-rate-limit");
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');

// Routers
const userRouter = require("./routes/userRoutes");
const issueRouter = require("./routes/issueRoutes");
const authRouter = require('./routes/auth');

const app = express();
app.use(cookieParser());
app.set('trust proxy', 1);
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
const allowedOrigins = ['http://localhost:3000', 'https://mycity-omega.vercel.app','https://mycity-frontend.netlify.app'];
app.options('*', cors());
app.use(cors({
    origin: function(origin, callback){
      // allow requests with no origin (like mobile apps or curl requests)
      if(!origin) return callback(null, true);
      if(allowedOrigins.indexOf(origin) === -1){
        var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true
}));

app.use(logger('dev')); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(cors({
    origin: ['https://mycity-omega.vercel.app','http://localhost:3000/'],
    credentials: true
  }));

app.use(cookieSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL }),
    cookie: { secure: true }
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
app.use("/api/users",userRouter);
app.use("/issues", issueRouter);
app.use("/", authRouter);


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
