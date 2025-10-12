// Este archivo define los endpoints públicos de la API relacionados con los pagos.
const express = require("express");
const router = express.Router();
const pagoController = require("../controllers/pago.controller");

// POST /api/pagos
router.post("/", pagoController.crearPago);

// GET /api/pagos
router.get("/", pagoController.listarPagos);

// GET /api/pagos/:id
router.get("/:id", pagoController.obtenerPago);

// PUT /api/pagos/:id/estado
router.put("/:id/estado", pagoController.actualizarEstadoPago);

// POST /api/pagos/webhook
router.post("/webhook", pagoController.recibirWebhook);

module.exports = router;
