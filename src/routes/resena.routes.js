const express = require("express");
const router = express.Router();
const ResenaController = require("../controllers/resena.controller");
const auth = require("../middleware/auth");

// Crear reseña
router.post("/", auth, ResenaController.crear);

// Listar todas (solo admin)
router.get("/", auth, ResenaController.listarTodas);

// Listar por producto (acceso público)
router.get("/producto/:id_producto", ResenaController.listarPorProducto);

// Actualizar reseña (solo autor)
router.put("/:id_reseña", auth, ResenaController.actualizar);

module.exports = router;
