const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const env = require('./env');
const userRepository = require('../repositories/user.repository');
const cometchatService = require('../services/cometchat.service');

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

        cometchatService.upsertUser(user).then(() => {
          console.log('[CometChat] User registered:', user.id, user.name);
        }).catch((err) => {
          console.error('[CometChat] Failed to register user:', err.response?.data || err.message);
        });

        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

module.exports = passport;
