const dotenv = require('dotenv');

dotenv.config();

const required = [
  'JWT_SECRET',
  'MYSQL_HOST',
  'MYSQL_USER',
  'MYSQL_DATABASE',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_CALLBACK_URL',
  'FRONTEND_URL'
];

const missing = required.filter((key) => !process.env[key]);

if (missing.length) {
  console.warn(`Missing environment variables: ${missing.join(', ')}`);
}

module.exports = {
  port: Number(process.env.PORT || 3000),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:4200',
  jwtSecret: process.env.JWT_SECRET || 'change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  mysql: {
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL,
    calendarRedirectUri:
      process.env.GOOGLE_CALENDAR_REDIRECT_URI || process.env.GOOGLE_CALLBACK_URL
  },
  cometChat: {
    appId: process.env.COMETCHAT_APP_ID || '',
    region: process.env.COMETCHAT_REGION || '',
    apiKey: process.env.COMETCHAT_API_KEY || '',
    authKey: process.env.COMETCHAT_AUTH_KEY || ''
  }
};
