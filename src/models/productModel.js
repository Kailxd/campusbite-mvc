const pool = require('../config/db');

async function getAll() {
  const { rows } = await pool.query('SELECT * FROM products ORDER BY id');
  return rows;
}

async function getActive() {
  const { rows } = await pool.query('SELECT * FROM products WHERE active = TRUE ORDER BY id');
  return rows;
}

async function findById(id) {
  const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
  return rows[0] || null;
}

async function create({ name, category, price, stock, description, active }) {
  const { rows } = await pool.query(
    'INSERT INTO products(name, category, price, stock, description, active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [name, category, price, stock, description, active]
  );
  return rows[0];
}

async function update(id, { name, category, price, stock, description, active }) {
  const { rows } = await pool.query(
    `UPDATE products
     SET name = $1, category = $2, price = $3, stock = $4, description = $5, active = $6
     WHERE id = $7 RETURNING *`,
    [name, category, price, stock, description, active, id]
  );
  return rows[0] || null;
}

async function remove(id) {
  await pool.query('DELETE FROM products WHERE id = $1', [id]);
}

module.exports = { getAll, getActive, findById, create, update, remove };
