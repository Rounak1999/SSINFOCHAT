const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
const env = require('./config/env');
const authRoutes = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat.routes');
const calendarRoutes = require('./routes/calendar.routes');
const { errorHandler } = require('./middlewares/error.middleware');

const app = express();

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true
  })
);
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);
app.use('/calendar', calendarRoutes);
app.use(errorHandler);

module.exports = app;
