const express = require("express");
const router = express.Router();
const VariantesProductoController = require("../controllers/variantesProducto.controller");

// Listar todas las variantes
router.get("/", VariantesProductoController.obtenerTodas);

// Obtener variantes de un producto
router.get("/:id_producto", VariantesProductoController.obtenerPorProducto);

// Crear una nueva variante
router.post("/", VariantesProductoController.crear);

// Actualizar una variante
router.put("/:id_variante", VariantesProductoController.actualizar);

// Eliminar una variante
router.delete("/:id_variante", VariantesProductoController.eliminar);

module.exports = router;
