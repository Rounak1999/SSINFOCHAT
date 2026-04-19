const { validationResult } = require('express-validator');
const calendarService = require('../services/calendar.service');

async function createEvent(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors;
    }

    const event = await calendarService.createEvent(req.user, {
      title: req.body.title,
      startDateTime: req.body.startDateTime,
      endDateTime: req.body.endDateTime
    });

    res.status(201).json({
      id: event.id,
      htmlLink: event.htmlLink,
      status: event.status
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createEvent
};
