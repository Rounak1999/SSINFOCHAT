const { google } = require('googleapis');
const env = require('../config/env');

function getOAuthClient(user) {
  const client = new google.auth.OAuth2(
    env.google.clientId,
    env.google.clientSecret,
    env.google.calendarRedirectUri
  );

  client.setCredentials({
    access_token: user.google_access_token,
    refresh_token: user.google_refresh_token
  });

  return client;
}

async function createEvent(user, payload) {
  const auth = getOAuthClient(user);
  const calendar = google.calendar({ version: 'v3', auth });

  const response = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: {
      summary: payload.title,
      start: {
        dateTime: payload.startDateTime
      },
      end: {
        dateTime: payload.endDateTime
      }
    }
  });

  return response.data;
}

module.exports = {
  createEvent
};
