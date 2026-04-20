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
  try {
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
  } catch (error) {
    const googleMessage =
      error?.response?.data?.error?.message ||
      error?.cause?.message ||
      error?.message ||
      'Google Calendar request failed.';

    if (googleMessage.toLowerCase().includes('insufficient authentication scopes')) {
      const scopedError = new Error(
        'Google Calendar access is missing required scope. Log out, sign in again, and grant calendar permission.'
      );
      scopedError.statusCode = 403;
      throw scopedError;
    }

    const calendarError = new Error(`Google Calendar request failed: ${googleMessage}`);
    calendarError.statusCode = error?.code || 500;
    throw calendarError;
  }
}

module.exports = {
  createEvent
};
