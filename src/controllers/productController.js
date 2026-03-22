const Product = require('../models/productModel');

async function index(req, res) {
  const products = await Product.getAll();
  res.render('products/index', { title: 'Productos', products });
}

function createForm(req, res) {
  res.render('products/form', { title: 'Nuevo producto', product: null, action: '/productos', method: 'POST' });
}

async function store(req, res) {
  try {
    const { name, category, price, stock, description, active } = req.body;
    await Product.create({
      name,
      category,
      price: Number(price),
      stock: Number(stock),
      description,
      active: active === 'on'
    });
    req.session.success = 'Producto creado correctamente.';
    res.redirect('/productos');
  } catch (error) {
    req.session.error = 'No se pudo crear el producto.';
    res.redirect('/productos/nuevo');
  }
}

async function editForm(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) {
    req.session.error = 'Producto no encontrado.';
    return res.redirect('/productos');
  }
  res.render('products/form', { title: 'Editar producto', product, action: `/productos/${product.id}?_method=PUT`, method: 'POST' });
}

async function update(req, res) {
  try {
    const { name, category, price, stock, description, active } = req.body;
    await Product.update(req.params.id, {
      name,
      category,
      price: Number(price),
      stock: Number(stock),
      description,
      active: active === 'on'
    });
    req.session.success = 'Producto actualizado correctamente.';
    res.redirect('/productos');
  } catch (error) {
    req.session.error = 'No se pudo actualizar el producto.';
    res.redirect(`/productos/${req.params.id}/editar`);
  }
}

async function destroy(req, res) {
  try {
    await Product.remove(req.params.id);
    req.session.success = 'Producto eliminado.';
  } catch (error) {
    req.session.error = 'No se pudo eliminar el producto.';
  }
  res.redirect('/productos');
}

module.exports = { index, createForm, store, editForm, update, destroy };
