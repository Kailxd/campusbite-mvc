const express = require('express');
const controller = require('../controllers/orderController');
const { requireRole, requireAuth } = require('../middlewares/auth');

const router = express.Router();

router.get('/', requireAuth, controller.index);
router.get('/nuevo', requireRole('estudiante', 'admin', 'empleado'), controller.createForm);
router.post('/', requireRole('estudiante', 'admin', 'empleado'), controller.store);

router.get('/:id', requireAuth, controller.show);
router.get('/:id/pagar', requireRole('estudiante', 'admin', 'empleado'), controller.payForm);
router.post('/:id/pagar', requireRole('estudiante', 'admin', 'empleado'), controller.processPayment);

router.put('/:id/status', requireRole('admin', 'empleado'), controller.updateStatus);

module.exports = router;