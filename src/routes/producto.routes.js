// ======================================================================
// Define los endpoints RESTful relacionados con los productos y sus variantes.
// ======================================================================

const express = require("express");
const router = express.Router();
const ProductoController = require("../controllers/producto.controller");
const VariantesProductoController = require("../controllers/variantesProducto.controller");

// ----------------------------------------------------------------------
// Documentación rápida de endpoints:
// GET    /api/productos                    -> Lista todos los productos
// GET    /api/productos/:id               -> Obtiene un producto por ID
// POST   /api/productos                   -> Crea un nuevo producto
// PUT    /api/productos/:id               -> Actualiza un producto existente
// DELETE /api/productos/:id               -> Elimina un producto (baja lógica)
// 
// GET    /api/productos/:id/variantes     -> Lista variantes de un producto
// POST   /api/productos/:id/variantes     -> Crea una nueva variante para un producto
// PUT    /api/productos/:id/variantes/:id_variante    -> Actualiza una variante
// DELETE /api/productos/:id/variantes/:id_variante    -> Elimina una variante
// ----------------------------------------------------------------------

// Rutas para productos CRUD
router.get("/", ProductoController.getAll);
router.get("/:id", ProductoController.getById);
router.post("/", ProductoController.create);
router.put("/:id", ProductoController.update);
router.delete("/:id", ProductoController.remove);

// Rutas para variantes de productos (anidadas)
router.get("/:id/variantes", VariantesProductoController.obtenerPorProducto);
router.post("/:id/variantes", VariantesProductoController.crear);
router.put("/:id/variantes/:id_variante", VariantesProductoController.actualizar);
router.delete("/:id/variantes/:id_variante", VariantesProductoController.eliminar);

module.exports = router;
