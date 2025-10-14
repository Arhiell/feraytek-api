const SoporteModel = require("../models/soporte.model");

const SoporteService = {
  async crear(id_usuario, asunto, mensaje, canal = "whatsapp") {
    if (!id_usuario || !asunto || !mensaje)
      throw createError(400, "Datos incompletos para crear ticket de soporte");

    const id_soporte = await SoporteModel.crear(
      id_usuario,
      asunto,
      mensaje,
      canal
    );
    return id_soporte;
  },

  async listarTodos() {
    return await SoporteModel.obtenerTodos();
  },

  async obtenerPorId(id_soporte) {
    const ticket = await SoporteModel.obtenerPorId(id_soporte);
    if (!ticket) throw createError(404, "Ticket de soporte no encontrado");
    return ticket;
  },

  async responder(id_soporte, respuesta, estado = "respondido") {
    if (!respuesta) throw createError(400, "Debe indicar una respuesta válida");

    const actualizado = await SoporteModel.responder(
      id_soporte,
      respuesta,
      estado
    );
    if (!actualizado)
      throw createError(404, "No se pudo actualizar el ticket de soporte");
    return actualizado;
  },
};

module.exports = SoporteService;
