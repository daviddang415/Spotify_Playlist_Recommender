require('dotenv').config()

const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use(new SpotifyStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: process.env.callBackURL}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));
