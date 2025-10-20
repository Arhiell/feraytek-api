// ======================================================================
// Rutas de Usuario
// Define los endpoints para usuarios y autenticación
// ======================================================================

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth');

// Rutas públicas (sin autenticación)
router.post('/login', userController.login);
router.post('/register/cliente', userController.registerCliente);

// Rutas protegidas (requieren autenticación)
router.get('/profile/:id', authMiddleware.verifyToken, userController.getUserById);
router.put('/profile/cliente/:id', authMiddleware.verifyToken, authMiddleware.isOwnerOrAdmin, userController.updateClienteProfile);
router.put('/password/:id', authMiddleware.verifyToken, authMiddleware.isOwnerOrAdmin, userController.changePassword);

// Rutas solo para administradores
router.get('/', authMiddleware.verifyToken, authMiddleware.isAdmin, userController.getAllUsers);
router.post('/register/admin', authMiddleware.verifyToken, authMiddleware.isAdmin, userController.registerAdmin);

// Ruta para actualizar usuario (cliente puede actualizar sus propios datos, admin puede actualizar cualquiera)
router.put('/:id', authMiddleware.verifyToken, authMiddleware.isOwnerOrAdmin, userController.updateClienteProfile);
router.put('/profile/admin/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, userController.updateAdminProfile);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, userController.deleteUser);

module.exports = router;