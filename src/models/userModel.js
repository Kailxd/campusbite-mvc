const pool = require('../config/db');

async function findByEmail(email) {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0] || null;
}

async function findById(id) {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return rows[0] || null;
}

async function getAll() {
  const { rows } = await pool.query('SELECT id, full_name, email, role, created_at FROM users ORDER BY id');
  return rows;
}

async function create({ full_name, email, password_hash, role }) {
  const { rows } = await pool.query(
    'INSERT INTO users(full_name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, full_name, email, role',
    [full_name, email, password_hash, role]
  );
  return rows[0];
}

async function update(id, { full_name, email, role }) {
  const { rows } = await pool.query(
    'UPDATE users SET full_name = $1, email = $2, role = $3 WHERE id = $4 RETURNING id, full_name, email, role',
    [full_name, email, role, id]
  );
  return rows[0] || null;
}

async function remove(id) {
  await pool.query('DELETE FROM users WHERE id = $1', [id]);
}

module.exports = { findByEmail, findById, getAll, create, update, remove };
