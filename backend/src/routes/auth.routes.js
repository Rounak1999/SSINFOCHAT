const express = require('express');
const passport = require('passport');
const { requireAuth } = require('../middlewares/auth.middleware');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar.events'],
    session: false,
    accessType: 'offline',
    prompt: 'consent select_account',
    includeGrantedScopes: false
  })
);

router.get(
  '/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/google',
    session: false
  }),
  authController.googleCallback
);

router.get('/logout', authController.logout);
router.get('/me', requireAuth, authController.me);
router.get('/chat-token', requireAuth, authController.chatToken);

module.exports = router;
