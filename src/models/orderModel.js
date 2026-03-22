const pool = require('../config/db');

async function getAllWithUsers() {
  const { rows } = await pool.query(`
    SELECT o.*, u.full_name
    FROM orders o
    LEFT JOIN users u ON u.id = o.user_id
    ORDER BY o.created_at DESC, o.id DESC
  `);
  return rows;
}

async function getByUser(userId) {
  const { rows } = await pool.query(
    'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC, id DESC',
    [userId]
  );
  return rows;
}

async function findById(id) {
  const orderRes = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
  if (orderRes.rowCount === 0) return null;
  const itemsRes = await pool.query('SELECT * FROM order_items WHERE order_id = $1 ORDER BY id', [id]);
  return { ...orderRes.rows[0], items: itemsRes.rows };
}

async function createTransactional({ userId, items }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let total = 0;
    const resolvedItems = [];

    for (const item of items) {
      const quantity = Number(item.quantity);
      const productId = Number(item.product_id);
      const productRes = await client.query('SELECT * FROM products WHERE id = $1 FOR UPDATE', [productId]);
      if (productRes.rowCount === 0) throw new Error('Producto no encontrado.');
      const product = productRes.rows[0];
      if (!product.active) throw new Error(`El producto ${product.name} no está activo.`);
      if (quantity <= 0) throw new Error('Cantidad inválida.');
      if (product.stock < quantity) throw new Error(`Stock insuficiente para ${product.name}.`);

      const subtotal = Number(product.price) * quantity;
      total += subtotal;
      resolvedItems.push({
        productId: product.id,
        productName: product.name,
        quantity,
        unitPrice: Number(product.price),
        subtotal
      });

      await client.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [quantity, product.id]);
    }

    const orderRes = await client.query(
      'INSERT INTO orders(user_id, status, total) VALUES ($1, $2, $3) RETURNING *',
      [userId, 'Pendiente', total.toFixed(2)]
    );

    for (const item of resolvedItems) {
      await client.query(
        `INSERT INTO order_items(order_id, product_id, product_name, quantity, unit_price, subtotal)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [orderRes.rows[0].id, item.productId, item.productName, item.quantity, item.unitPrice, item.subtotal.toFixed(2)]
      );
    }

    await client.query('COMMIT');
    return orderRes.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function updateStatus(id, status) {
  const { rows } = await pool.query('UPDATE orders SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
  return rows[0] || null;
}

module.exports = { getAllWithUsers, getByUser, findById, createTransactional, updateStatus };
