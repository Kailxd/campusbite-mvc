const express = require('express');
const controller = require('../controllers/userController');
const { requireRole } = require('../middlewares/auth');

const router = express.Router();
router.get('/', requireRole('admin'), controller.index);
router.get('/nuevo', requireRole('admin'), controller.createForm);
router.post('/', requireRole('admin'), controller.store);
router.get('/:id/editar', requireRole('admin'), controller.editForm);
router.put('/:id', requireRole('admin'), controller.update);
router.delete('/:id', requireRole('admin'), controller.destroy);

module.exports = router;
