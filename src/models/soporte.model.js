const db = require("../config/database");

const SoporteModel = {
  // Crear un nuevo ticket de soporte

  async crear(id_usuario, asunto, mensaje, canal = "whatsapp") {
    const sql = `
      INSERT INTO soporte (id_usuario, asunto, mensaje, canal)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [
      id_usuario,
      asunto,
      mensaje,
      canal,
    ]);
    return result.insertId;
  },

  // Listar todos los tickets registrados

  async obtenerTodos() {
    const sql = `
      SELECT s.id_soporte, s.id_usuario, u.nombre_usuario, s.asunto, s.mensaje,
             s.canal, s.estado, s.fecha_creacion, s.respuesta, s.fecha_respuesta
      FROM soporte s
      JOIN usuarios u ON s.id_usuario = u.id_usuario
      ORDER BY s.fecha_creacion DESC
    `;
    const [rows] = await db.execute(sql);
    return rows;
  },

  // Obtener un ticket específico por ID
  async obtenerPorId(id_soporte) {
    const sql = `
      SELECT s.*, u.nombre_usuario
      FROM soporte s
      JOIN usuarios u ON s.id_usuario = u.id_usuario
      WHERE s.id_soporte = ?
    `;
    const [rows] = await db.execute(sql, [id_soporte]);
    return rows[0];
  },

  // Actualizar estado y respuesta del ticket
  async responder(id_soporte, respuesta, estado = "respondido") {
    const sql = `
      UPDATE soporte
      SET respuesta = ?, estado = ?, fecha_respuesta = NOW()
      WHERE id_soporte = ?
    `;
    const [result] = await db.execute(sql, [respuesta, estado, id_soporte]);
    return result.affectedRows > 0;
  },
};

module.exports = SoporteModel;
