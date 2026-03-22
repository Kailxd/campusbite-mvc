const Product = require('../models/productModel');
const Order = require('../models/orderModel');

async function index(req, res) {
  const user = req.session.user;
  const orders = user.role === 'estudiante' ? await Order.getByUser(user.id) : await Order.getAllWithUsers();
  res.render('orders/index', { title: 'Pedidos', orders, role: user.role });
}

async function createForm(req, res) {
  const products = await Product.getActive();
  res.render('orders/form', { title: 'Nuevo pedido', products });
}

async function store(req, res) {
  try {
    let { product_id, quantity } = req.body;
    if (!Array.isArray(product_id)) product_id = [product_id];
    if (!Array.isArray(quantity)) quantity = [quantity];

    const items = product_id.map((pid, index) => ({
      product_id: Number(pid),
      quantity: Number(quantity[index])
    })).filter(item => item.product_id && item.quantity > 0);

    if (items.length === 0) {
      req.session.error = 'Debes seleccionar al menos un producto con cantidad válida.';
      return res.redirect('/pedidos/nuevo');
    }

    const order = await Order.createTransactional({ userId: req.session.user.id, items });
    req.session.success = `Pedido #${order.id} creado correctamente.`;
    res.redirect('/pedidos');
  } catch (error) {
    req.session.error = error.message || 'No se pudo crear el pedido.';
    res.redirect('/pedidos/nuevo');
  }
}

async function updateStatus(req, res) {
  try {
    await Order.updateStatus(req.params.id, req.body.status);
    req.session.success = 'Estado del pedido actualizado.';
  } catch (error) {
    req.session.error = 'No se pudo actualizar el estado.';
  }
  res.redirect('/pedidos');
}

async function show(req, res) {
  const order = await Order.findById(req.params.id);
  if (!order) {
    req.session.error = 'Pedido no encontrado.';
    return res.redirect('/pedidos');
  }
  res.render('orders/show', { title: `Pedido #${order.id}`, order });
}

module.exports = { index, createForm, store, updateStatus, show };
