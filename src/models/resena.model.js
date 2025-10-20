const db = require("../config/database");

const ResenaModel = {
  /**
   * Crear una nueva reseña
   * @param {number} id_usuario - ID del autor (cliente autenticado)
   * @param {number} id_producto - ID del producto reseñado
   * @param {number} calificacion - Valor numérico (1 a 5)
   * @param {string} comentario - Texto libre (opcional)
   */

  async crear(id_usuario, id_producto, calificacion, comentario) {
    const sql = `
      INSERT INTO resenas (id_usuario, id_producto, calificacion, comentario)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [
      id_usuario,
      id_producto,
      calificacion,
      comentario,
    ]);
    return result.insertId;
  },

  /**
   * Obtener todas las reseñas de un producto específico.
   * Permite al usuario o visitante leer reseñas públicas.
   */
  async obtenerPorProducto(id_producto) {
    const sql = `
      SELECT r.id_resena, r.calificacion, r.comentario, r.fecharesena,
             u.nombre_usuario
      FROM resenas r
      JOIN usuarios u ON r.id_usuario = u.id_usuario
      WHERE r.id_producto = ?
      ORDER BY r.fecharesena DESC
    `;
    const [rows] = await db.execute(sql, [id_producto]);
    return rows;
  },

  /**
   * Obtener todas las reseñas del sistema (solo admin).
   */
  async obtenerTodas() {
    const sql = `
      SELECT r.id_resena, r.id_producto, p.nombre AS producto,
             r.id_usuario, u.nombre_usuario, r.calificacion,
             r.comentario, r.fecharesena
      FROM resenas r
      JOIN usuarios u ON r.id_usuario = u.id_usuario
      JOIN productos p ON r.id_producto = p.id_producto
      ORDER BY r.fecharesena DESC
    `;
    const [rows] = await db.execute(sql);
    return rows;
  },

  /**
   * Actualizar una reseña (solo autor).
   * Solo puede modificar su propio comentario y calificación.
   */
  async actualizar(id_reseña, id_usuario, calificacion, comentario) {
    const sql = `
      UPDATE resenas
      SET calificacion = ?, comentario = ?, fecharesena = NOW()
      WHERE id_resena = ? AND id_usuario = ?
    `;
    const [result] = await db.execute(sql, [
      calificacion,
      comentario,
      id_reseña,
      id_usuario,
    ]);
    return result.affectedRows > 0;
  },
};

module.exports = ResenaModel;
