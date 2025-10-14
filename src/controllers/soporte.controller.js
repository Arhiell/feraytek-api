const SoporteService = require("../services/soporte.service");

class SoporteController {
  static async crear(req, res) {
    try {
      const { id_usuario, asunto, mensaje, canal } = req.body;
      const id_soporte = await SoporteService.crear(
        id_usuario,
        asunto,
        mensaje,
        canal
      );
      res.status(201).json({
        mensaje: "Contacto de soporte creado exitosamente",
        id_soporte,
      });
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }

  static async listarTodos(req, res) {
    try {
      const tickets = await SoporteService.listarTodos();
      res.status(200).json(tickets);
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }

  static async obtenerPorId(req, res) {
    try {
      const { id_soporte } = req.params;
      const ticket = await SoporteService.obtenerPorId(id_soporte);
      res.status(200).json(ticket);
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }

  static async responder(req, res) {
    try {
      const { id_soporte } = req.params;
      const { respuesta, estado } = req.body;
      await SoporteService.responder(id_soporte, respuesta, estado);
      res.status(200).json({ mensaje: "Respuesta registrada correctamente" });
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }
}

module.exports = SoporteController;
