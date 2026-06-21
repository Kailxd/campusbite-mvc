const bcrypt = require('bcryptjs');
const pool = require('./db');

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(120) NOT NULL,
      email VARCHAR(120) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(30) NOT NULL DEFAULT 'estudiante',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      category VARCHAR(80) NOT NULL,
      price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
      stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
      description TEXT,
      active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      status VARCHAR(30) NOT NULL DEFAULT 'Pendiente',
      total NUMERIC(10,2) NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
      product_name VARCHAR(120) NOT NULL,
      quantity INTEGER NOT NULL CHECK (quantity > 0),
      unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
      subtotal NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0)
    );
  `);

  
  await pool.query(`
    ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) NOT NULL DEFAULT 'pendiente',
      ADD COLUMN IF NOT EXISTS payment_method VARCHAR(30),
      ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP NULL,
      ADD COLUMN IF NOT EXISTS payment_reference VARCHAR(100);
  `);

  const adminEmail = 'admin@campusbite.com';
  const existingAdmin = await pool.query('SELECT id FROM users WHERE email = $1', [adminEmail]);

  if (existingAdmin.rowCount === 0) {
    const passwordHash = await bcrypt.hash('Admin123*', 10);
    await pool.query(
      'INSERT INTO users(full_name, email, password_hash, role) VALUES ($1, $2, $3, $4)',
      ['Administrador CampusBite', adminEmail, passwordHash, 'admin']
    );
  }

  const productsCount = await pool.query('SELECT COUNT(*)::int AS count FROM products');
  if (productsCount.rows[0].count === 0) {
    await pool.query(`
      INSERT INTO products(name, category, price, stock, description) VALUES
      ('Café Americano', 'Bebidas', 25.00, 40, 'Café negro tradicional.'),
      ('Capuchino', 'Bebidas', 35.00, 30, 'Capuchino espumoso.'),
      ('Sándwich de Jamón', 'Alimentos', 42.00, 20, 'Sándwich clásico.'),
      ('Molletes', 'Alimentos', 45.00, 18, 'Molletes con frijol y queso.'),
      ('Agua Embotellada', 'Bebidas', 18.00, 60, 'Botella de agua 600ml.');
    `);
  }
}

module.exports = initDb;
