// ======================================================================
// Define los endpoints RESTful relacionados con los productos.
// ======================================================================

const express = require("express");
const router = express.Router();
const ProductoController = require("../controllers/producto.controller");

// ----------------------------------------------------------------------
// Documentación rápida de endpoints:
// GET    /api/productos        -> Lista todos los productos
// GET    /api/productos/:id    -> Obtiene un producto por ID
// POST   /api/productos        -> Crea un nuevo producto
// PUT    /api/productos/:id    -> Actualiza un producto existente
// DELETE /api/productos/:id    -> Elimina un producto (baja lógica)
// ----------------------------------------------------------------------

// Rutas para productos CRUD
router.get("/", ProductoController.getAll);
router.get("/:id", ProductoController.getById);
router.post("/", ProductoController.create);
router.put("/:id", ProductoController.update);
router.delete("/:id", ProductoController.remove);

module.exports = router;
