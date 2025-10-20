const express = require("express");
const router = express.Router();
const ResenaController = require("../controllers/resena.controller");
const { verifyToken, isAdmin } = require("../middleware/auth");

// Crear reseña
router.post("/", verifyToken, ResenaController.crear);

// Listar todas (solo admin)
router.get("/", verifyToken, isAdmin, ResenaController.listarTodas);

// Listar por producto (acceso público)
router.get("/producto/:id_producto", ResenaController.listarPorProducto);

// Actualizar reseña (solo autor)
router.put("/:id_reseña", verifyToken, ResenaController.actualizar);

module.exports = router;
