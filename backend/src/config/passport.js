const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const env = require('./env');
const userRepository = require('../repositories/user.repository');

passport.use(
  new GoogleStrategy(
    {
      clientID: env.google.clientId,
      clientSecret: env.google.clientSecret,
      callbackURL: env.google.callbackUrl,
      scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar.events'],
      accessType: 'offline',
      prompt: 'consent'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await userRepository.upsertGoogleUser({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0]?.value,
          avatarUrl: profile.photos?.[0]?.value || null,
          googleAccessToken: accessToken,
          googleRefreshToken: refreshToken || null
        });

        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

module.exports = passport;
