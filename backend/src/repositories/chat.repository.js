const pool = require('../config/db');

async function createMessage({ senderId, receiverId, message }) {
  const [result] = await pool.execute(
    'INSERT INTO chat_messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
    [senderId, receiverId, message]
  );

  const [rows] = await pool.execute(
    `SELECT id, sender_id AS senderId, receiver_id AS receiverId, message, created_at AS timestamp
     FROM chat_messages
     WHERE id = ?`,
    [result.insertId]
  );

  return rows[0];
}

async function findHistory(userId, peerId) {
  const [rows] = await pool.execute(
    `SELECT id, sender_id AS senderId, receiver_id AS receiverId, message, created_at AS timestamp
     FROM chat_messages
     WHERE (sender_id = ? AND receiver_id = ?)
        OR (sender_id = ? AND receiver_id = ?)
     ORDER BY created_at ASC`,
    [userId, peerId, peerId, userId]
  );

  return rows;
}

module.exports = {
  createMessage,
  findHistory
};
