const express = require("express");
const router = express.Router();
const HistorialPedidosController = require("../controllers/historialPedidos.controller");

// Rutas disponibles
router.get("/", HistorialPedidosController.listar); // Listar todos los historiales
router.get("/pedido/:id_pedido", HistorialPedidosController.listarPorPedido); // Por pedido
router.post("/", HistorialPedidosController.registrar); // Registrar cambio

module.exports = router;
