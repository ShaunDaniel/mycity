const express = require("express");
const path = require('path');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const logger = require('morgan');
const passport = require('passport');
const cors = require('cors');
require('dotenv').config();


//Routes
const userRouter = require("./routes/userRoutes");
const issueRouter = require("./routes/issueRoutes");
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');



const app = express();
const port = 3001;


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/users", userRouter);
app.use("/issues", issueRouter);
app.use("/", authRouter);
app.use("/", indexRouter);

app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
});
