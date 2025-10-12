const express = require("express");
const router = express.Router();
const FacturaController = require("../controllers/factura.controller");

// Obtener todas las facturas
router.get("/", FacturaController.obtenerTodas);

// Obtener factura por ID
router.get("/:id", FacturaController.obtenerPorId);

// Crear nueva factura
router.post("/", FacturaController.crear);

// Marcar como enviada
router.patch("/:id/enviar", FacturaController.marcarEnviada);

module.exports = router;
