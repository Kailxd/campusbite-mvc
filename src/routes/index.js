const express = require('express');
const homeController = require('../controllers/homeController');
const authController = require('../controllers/authController');
const { requireAuth } = require('../middlewares/auth');

const router = express.Router();
router.get('/', homeController.home);
router.get('/dashboard', requireAuth, homeController.dashboard);
router.get('/login', authController.showLogin);
router.post('/login', authController.login);
router.get('/register', authController.showRegister);
router.post('/register', authController.register);
router.post('/logout', authController.logout);

module.exports = router;
