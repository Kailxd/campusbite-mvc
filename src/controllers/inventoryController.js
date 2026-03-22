const Product = require('../models/productModel');

async function index(req, res) {
  const products = await Product.getAll();
  res.render('inventory/index', { title: 'Inventario', products });
}

async function updateStock(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      req.session.error = 'Producto no encontrado.';
      return res.redirect('/inventario');
    }
    const newStock = Number(req.body.stock);
    await Product.update(product.id, {
      name: product.name,
      category: product.category,
      price: Number(product.price),
      stock: newStock,
      description: product.description,
      active: product.active
    });
    req.session.success = 'Inventario actualizado correctamente.';
  } catch (error) {
    req.session.error = 'No se pudo actualizar el inventario.';
  }
  res.redirect('/inventario');
}

module.exports = { index, updateStock };
