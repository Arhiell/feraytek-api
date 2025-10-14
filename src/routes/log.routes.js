const express = require("express");
const router = express.Router();
const LogController = require("../controllers/log.controller");
const auth = require("../middleware/auth");

// Listar todos los logs
router.get("/", auth, LogController.listarTodos);

// Filtrar por usuario
router.get("/usuario/:id_usuario", auth, LogController.listarPorUsuario);

// Ver detalle de log
router.get("/:id_log", auth, LogController.obtenerDetalle);

module.exports = router;

/**
 * ----------------------------------------------------------------------
 *  GIT TRACKING
 * ----------------------------------------------------------------------
 *  $
 *  $
 * ======================================================================
 */
