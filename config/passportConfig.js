const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

// console.log("process.env.FACEBOOK_APP_ID",process.env.FACEBOOK_APP_ID)
// console.log("process.env.FACEBOOK_APP_SECRET",process.env.FACEBOOK_APP_SECRET)
// console.log("process.env.FACEBOOK_CALLBACK_URL",process.env.FACEBOOK_CALLBACK_URL)
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ['id', 'displayName', 'emails', 'photos'],
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, { profile, accessToken });
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));


module.exports = passport;