const express = require("express");
const router = express.Router();
const SoporteController = require("../controllers/soporte.controller");
const auth = require("../middleware/auth");

// Crear ticket (admin o superadmin)
// router.post("/", auth, SoporteController.crear);

// Listar todos los tickets
router.get("/", auth, SoporteController.listarTodos);

// Obtener un ticket específico
router.get("/:id_soporte", auth, SoporteController.obtenerPorId);

// Registrar respuesta del staff
router.put("/:id_soporte/responder", auth, SoporteController.responder);

module.exports = router;
