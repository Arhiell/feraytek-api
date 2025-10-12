// Este módulo define las rutas HTTP para gestionar los envíos de pedidos.

const express = require("express");
const router = express.Router();

// Importamos el controlador de envíos
const EnvioController = require("../controllers/envio.controller");

// (Opcional) Middleware de autenticación y validación
const { verificarToken, verificarRolAdmin } = require("../middleware/auth");

// Lista de Envios
router.get("/", EnvioController.listarEnvios);

// Obtener envio por ID
router.get("/:id", EnvioController.obtenerEnvio);

// Crear Nuevo Envio
router.post("/", EnvioController.crearEnvio);

//Actualizar Datos de Envios
router.put("/:id", EnvioController.actualizarDatosEnvio);

//Cambios de Estado de Envios
router.put("/:id/estado", EnvioController.cambiarEstadoEnvio);

// Eliminar Envio
router.delete("/:id", EnvioController.eliminarEnvio);

module.exports = router;
