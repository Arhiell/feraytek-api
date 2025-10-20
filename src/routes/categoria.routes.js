// ======================================================================
// Rutas de Categorías
// Define los endpoints para gestión de categorías de productos
// ======================================================================

const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoria.controller');
const authMiddleware = require('../middleware/auth');

// Rutas públicas (sin autenticación) - Para mostrar categorías en el frontend
router.get('/activas', categoriaController.getActiveCategorias);
router.get('/stats', categoriaController.getCategoriaStats);
router.get('/:id', categoriaController.getCategoriaById);

// Rutas protegidas - Solo administradores pueden gestionar categorías
router.get('/', authMiddleware.verifyToken, authMiddleware.isAdmin, categoriaController.getAllCategorias);
router.post('/', authMiddleware.verifyToken, authMiddleware.isAdmin, categoriaController.createCategoria);
router.put('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, categoriaController.updateCategoria);

// Cambiar estado de categoría (toggle activa/inactiva) - Soft delete
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, categoriaController.toggleCategoriaStatus);

// Eliminación permanente - Solo para casos especiales
router.delete('/:id/permanent', authMiddleware.verifyToken, authMiddleware.isAdmin, categoriaController.deleteCategoria);

module.exports = router;