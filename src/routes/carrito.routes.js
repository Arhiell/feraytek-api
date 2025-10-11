// =====================================================================
// Define los endpoints RESTful relacionados al carrito de compras.
// ======================================================================

const express = require("express");
const router = express.Router();
const CarritoController = require("../controllers/carrito.controller");

// ----------------------------------------------------------------------
// Documentación rápida de endpoints:
// GET    /api/carrito          -> Lista los productos del carrito activo
// POST   /api/carrito          -> Agrega un producto al carrito
// DELETE /api/carrito/item     -> Elimina un producto del carrito
// DELETE /api/carrito          -> Vacía el carrito completo
// ----------------------------------------------------------------------

// Rutas y controladores para el carrito de compras para sus CRUD
router.get("/", CarritoController.listar);
router.post("/", CarritoController.agregar);
router.delete("/item", CarritoController.eliminar);
router.delete("/", CarritoController.vaciar);

module.exports = router;
