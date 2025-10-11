// ======================================================================
// Define los endpoints RESTful para el módulo de pedidos.
// ======================================================================

const express = require("express");
const router = express.Router();
const PedidoController = require("../controllers/pedido.controller");

router.post("/", PedidoController.crearDesdeCarrito); //  -> Crear pedido desde carrito

router.get("/", PedidoController.listar); // -> Listar pedidos del usuario
router.get("/:id", PedidoController.detalle); // -> Obtener detalle completo
router.put("/:id/estado", PedidoController.actualizarEstado); // -> Cambiar estado del pedido

module.exports = router;
