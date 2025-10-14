const ResenaModel = require("../models/resena.model");
const createError = require("http-errors");

const ResenaService = {
  // Crear una reseña validando campos obligatorios
  async crear(id_usuario, id_producto, calificacion, comentario) {
    if (!id_usuario || !id_producto || !calificacion) {
      throw createError(400, "Faltan datos obligatorios para crear reseña");
    }
    if (calificacion < 1 || calificacion > 5) {
      throw createError(400, "La calificación debe estar entre 1 y 5");
    }
    return await ResenaModel.crear(
      id_usuario,
      id_producto,
      calificacion,
      comentario
    );
  },

  // Listar reseñas de un producto
  async listarPorProducto(id_producto) {
    if (!id_producto) throw createError(400, "Debe indicar un producto válido");
    return await ResenaModel.obtenerPorProducto(id_producto);
  },

  // Listar todas las reseñas (solo admin)
  async listarTodas() {
    return await ResenaModel.obtenerTodas();
  },

  // Actualizar reseña (solo el autor puede hacerlo)
  async actualizar(id_reseña, id_usuario, calificacion, comentario) {
    if (!id_reseña || !id_usuario)
      throw createError(400, "Faltan datos obligatorios");
    if (calificacion < 1 || calificacion > 5)
      throw createError(400, "La calificación debe estar entre 1 y 5");
    const ok = await ResenaModel.actualizar(
      id_reseña,
      id_usuario,
      calificacion,
      comentario
    );
    if (!ok) throw createError(403, "No autorizado para modificar esta reseña");
    return ok;
  },
};

module.exports = ResenaService;
