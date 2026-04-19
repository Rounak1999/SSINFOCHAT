const axios = require('axios');
const env = require('../config/env');

function ensureConfigured() {
  if (!env.cometChat.appId || !env.cometChat.region || !env.cometChat.apiKey) {
    throw new Error('CometChat is not configured.');
  }
}

function headers() {
  return {
    appId: env.cometChat.appId,
    apikey: env.cometChat.apiKey,
    'Content-Type': 'application/json',
    Accept: 'application/json'
  };
}

function baseUrl() {
  return `https://${env.cometChat.appId}.api-${env.cometChat.region}.cometchat.io/v3`;
}

async function upsertUser(user) {
  ensureConfigured();

  const payload = {
    uid: String(user.id),
    name: user.name,
    email: user.email,
    avatar: user.avatar_url || undefined
  };

  try {
    await axios.post(`${baseUrl()}/users`, payload, { headers: headers() });
  } catch (error) {
    if (error.response?.status !== 400 && error.response?.status !== 409) {
      throw error;
    }

    await axios.put(`${baseUrl()}/users/${payload.uid}`, payload, { headers: headers() });
  }
}

async function createAuthToken(userId) {
  ensureConfigured();

  const response = await axios.post(
    `${baseUrl()}/users/${userId}/auth_tokens`,
    { force: true },
    { headers: headers() }
  );

  return response.data?.data?.authToken;
}

module.exports = {
  upsertUser,
  createAuthToken
};
