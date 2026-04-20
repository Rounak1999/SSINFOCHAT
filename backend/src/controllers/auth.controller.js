const jwtService = require('../services/jwt.service');
const userRepository = require('../repositories/user.repository');
const cometchatService = require('../services/cometchat.service');
const env = require('../config/env');

async function googleCallback(req, res, next) {
  try {
    const token = jwtService.signToken(req.user);
    const redirectUrl = new URL('/auth/callback', env.frontendUrl);

    redirectUrl.searchParams.set('token', token);
    res.redirect(redirectUrl.toString());
  } catch (error) {
    next(error);
  }
}

function logout(req, res) {
  req.logout?.(() => {});
  res.json({ message: 'Logged out successfully.' });
}

async function me(req, res) {
  const users = await userRepository.findAllExceptUser(req.user.id);

  res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      avatarUrl: req.user.avatar_url
    },
    users
  });
}

async function chatToken(req, res, next) {
  try {
    await cometchatService.upsertUser(req.user);
    const authToken = await cometchatService.createAuthToken(String(req.user.id));

    res.json({
      uid: String(req.user.id),
      authToken,
      appId: env.cometChat.appId,
      region: env.cometChat.region,
      authKey: env.cometChat.authKey
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  googleCallback,
  logout,
  me,
  chatToken
};
