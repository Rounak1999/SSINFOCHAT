const express = require('express');
const { body } = require('express-validator');
const { requireAuth } = require('../middlewares/auth.middleware');
const calendarController = require('../controllers/calendar.controller');

const router = express.Router();

router.post(
  '/create-event',
  requireAuth,
  body('title').trim().notEmpty(),
  body('startDateTime').isISO8601(),
  body('endDateTime').isISO8601(),
  calendarController.createEvent
);

module.exports = router;
