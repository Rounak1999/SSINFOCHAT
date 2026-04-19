const express = require('express');
const { body, query } = require('express-validator');
const { requireAuth } = require('../middlewares/auth.middleware');
const chatController = require('../controllers/chat.controller');

const router = express.Router();

router.post(
  '/send',
  requireAuth,
  body('receiverId').isInt({ min: 1 }),
  body('message').trim().notEmpty(),
  chatController.sendMessage
);

router.get(
  '/history',
  requireAuth,
  query('peerId').isInt({ min: 1 }),
  chatController.history
);

module.exports = router;
