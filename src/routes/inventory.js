const express = require('express');
const controller = require('../controllers/inventoryController');
const { requireRole } = require('../middlewares/auth');

const router = express.Router();
router.get('/', requireRole('admin', 'inventario', 'empleado'), controller.index);
router.put('/:id/stock', requireRole('admin', 'inventario', 'empleado'), controller.updateStock);

module.exports = router;
