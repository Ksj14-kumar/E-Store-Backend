const LocalStrategy = require("passport-local").Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const passport = require("passport");
const User = require("../db/UserSchema")
const bcrypt = require("bcrypt")
module.exports = () => {
    // ===========================================================Local Strategy=============================
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        session: false
    }, function (email, password, done) {
        User.findOne({ email:email.toLowerCase() }, async function (err, user) {
            console.log({ user })
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            const isMatch = await bcrypt.compare(password, user.password)
            if (isMatch && user.verify) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }))
    // ====================================================GOOGle Middleware====================


    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.BACKEND_DOMAIN+"/api/v1/google/callback",
        passReqToCallback: true
    },
        function (req, accessToken, refreshToken, profile, done) {
            console.log({ profile, refreshToken, accessToken })
            User.findOne({ email: profile._json.email.toLowerCase() }, async function (err, user) {
                if (err) {
                    return done(null, false)
                }
                else if (!user) {
                    //save user of not in db
                    // name: { familyName: 'Kumar', givenName: 'Sanju' },
                    console.log("email", profile.email)
                    const user = await new User({
                        name: profile.name.givenName,
                        lname:profile.name.familyName,
                        password: profile.id,
                        provider: profile.provider,
                        email: profile._json.email.toLowerCase(),
                        image: profile._json.picture,
                        verify: profile._json.verify
                    })
                    user.save(async (err) => {
                        if (err) {
                            console.log(err)
                            console.log("user is not save")
                            return done(null, false)
                        }
                        else {
                            const user = await User.findOne({ email: profile._json.email })
                            return done(null, user)
                        }
                    })
                }
                else {
                    return done(null, user);
                }
            });
        }
    ));

    // =============================================serializeUser user and deserializeUser use=============================
    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });
    passport.deserializeUser(function (id, done) {
        User.findById({ _id: id }, function (err, user) {
            console.log({ err })
            console.log({ user })
            if (err) {
                done(null, false, { error: err });
            }
            else {
                done(err, user);
            }
        });
    });
}