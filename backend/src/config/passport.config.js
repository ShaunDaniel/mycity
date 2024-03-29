const passport = require('passport');
const passportGoogle = require('passport-google-oauth20');
const User = require('../models/user');


const GoogleStrategy = passportGoogle.Strategy;
function useGoogleStrategy(){
    passport.use(new GoogleStrategy
        ({
            clientID: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            callbackURL: '/v1/auth/google/callback',

        }, (accessToken, refreshToken, profile, done) => {
            try {
                if (!profile._json.email) throw "User does not have email";
                User.findOne({ email: profile._json.email }).then((user) => {
                    
                    if (user) {
                        done(null, user);
                    } else {
                        const newUser = new User({
                            username: profile._json.name,
                            email: profile._json.email,
                            city: '-',
                            state_name: '-',
                            password: '-',
                            googleId: profile._json.sub,
                            firstName: profile._json.given_name,
                            lastName: profile._json.family_name,
                        });
                        newUser.save()
                            .then((user) => {
                                done(null, user);
                            })
                            .catch((err) => {
                                done(err);
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
