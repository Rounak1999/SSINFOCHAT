const { validationResult } = require('express-validator');
const chatRepository = require('../repositories/chat.repository');

async function sendMessage(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors;
    }

    const message = await chatRepository.createMessage({
      senderId: req.user.id,
      receiverId: Number(req.body.receiverId),
      message: req.body.message
    });

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
}

async function history(req, res, next) {
  try {
    const peerId = Number(req.query.peerId);
    const messages = await chatRepository.findHistory(req.user.id, peerId);
    res.json(messages);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  sendMessage,
  history
};
