const passport = require('passport');
const passportGoogle = require('passport-google-oauth20');
const User = require('../models/user');


const GoogleStrategy = passportGoogle.Strategy;
function useGoogleStrategy(){
    passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            callbackURL: '/v1/auth/google/callback',

        }, (accessToken, refreshToken, profile, done) => {
            try {
                if (!profile._json.email) throw "User does not have email";
                User.findOne({ email: profile._json.email }).then((currentUser) => {
                    if (currentUser) {
                        done(null, currentUser);
                    } else {
                        new User({
                            googleId: profile.id,
                            firstName: profile.name.givenName,
                            lastName: profile.name.familyName,
                            email: profile._json.email,
                        }).save().then((newUser) => {
                            done(null, newUser);
                        });
                    }
                

                });
            } catch (err) {
                console.error(err);
                done(err);
            }
        }
    ));
}


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    }).catch((err) => {
        done(err);
    });
});


module.exports = useGoogleStrategy
