const pool = require('../config/db');

async function upsertGoogleUser(user) {
  const sql = `
    INSERT INTO users (
      google_id,
      name,
      email,
      avatar_url,
      google_access_token,
      google_refresh_token
    )
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      email = VALUES(email),
      avatar_url = VALUES(avatar_url),
      google_access_token = VALUES(google_access_token),
      google_refresh_token = COALESCE(VALUES(google_refresh_token), google_refresh_token),
      updated_at = CURRENT_TIMESTAMP
  `;

  await pool.execute(sql, [
    user.googleId,
    user.name,
    user.email,
    user.avatarUrl,
    user.googleAccessToken,
    user.googleRefreshToken
  ]);

  const [rows] = await pool.execute(
    `SELECT id, google_id, name, email, avatar_url, google_access_token, google_refresh_token
     FROM users
     WHERE google_id = ?`,
    [user.googleId]
  );

  return rows[0];
}

async function findById(id) {
  const [rows] = await pool.execute(
    `SELECT id, google_id, name, email, avatar_url, google_access_token, google_refresh_token
     FROM users
     WHERE id = ?`,
    [id]
  );

  return rows[0] || null;
}

async function findAllExceptUser(id) {
  const [rows] = await pool.execute(
    'SELECT id, name, email, avatar_url FROM users WHERE id <> ? ORDER BY name ASC',
    [id]
  );

  return rows;
}

module.exports = {
  upsertGoogleUser,
  findById,
  findAllExceptUser
};
