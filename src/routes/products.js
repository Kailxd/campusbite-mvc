const express = require('express');
const controller = require('../controllers/productController');
const { requireRole } = require('../middlewares/auth');

const router = express.Router();
router.get('/', requireRole('admin', 'empleado', 'inventario'), controller.index);
router.get('/nuevo', requireRole('admin', 'empleado'), controller.createForm);
router.post('/', requireRole('admin', 'empleado'), controller.store);
router.get('/:id/editar', requireRole('admin', 'empleado'), controller.editForm);
router.put('/:id', requireRole('admin', 'empleado'), controller.update);
router.delete('/:id', requireRole('admin'), controller.destroy);

module.exports = router;
