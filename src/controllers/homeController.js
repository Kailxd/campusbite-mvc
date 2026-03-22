const Product = require('../models/productModel');
const Order = require('../models/orderModel');

async function home(req, res) {
  const products = await Product.getActive();
  res.render('home/index', { title: 'Inicio', products });
}

async function dashboard(req, res) {
  const user = req.session.user;
  let stats = {};
  if (user.role === 'admin' || user.role === 'empleado' || user.role === 'inventario') {
    const products = await Product.getAll();
    const orders = await Order.getAllWithUsers();
    stats = {
      productsCount: products.length,
      lowStockCount: products.filter(p => p.stock <= 10).length,
      ordersCount: orders.length,
      pendingCount: orders.filter(o => o.status === 'Pendiente').length
    };
  } else {
    const myOrders = await Order.getByUser(user.id);
    stats = { myOrdersCount: myOrders.length };
  }
  res.render('home/dashboard', { title: 'Dashboard', stats });
}

module.exports = { home, dashboard };
