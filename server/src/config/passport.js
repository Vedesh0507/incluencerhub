const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        if (!email) {
          return done(new Error('Google account has no email address associated with it'), null);
        }

        // Check if user already exists
        let user = await User.findOne({ email });

        if (user) {
          return done(null, user);
        }

        // Create user automatically if they do not exist
        // Generate a random password satisfying minlength 6 for DB validation
        const randomPassword = Math.random().toString(36).slice(-10) + 'A1!';
        
        user = await User.create({
          name: profile.displayName || (profile.name ? `${profile.name.givenName || ''} ${profile.name.familyName || ''}`.trim() : 'Google User'),
          email: email,
          password: randomPassword,
          role: 'creator', // Default role for new auto-registered users
          avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
          isVerified: true,
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Passport requires serialize/deserialize methods even if sessions are not used
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  done(null, null);
});

module.exports = passport;
