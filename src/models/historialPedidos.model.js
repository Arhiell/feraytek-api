const db = require("../config/database"); // Conexión a MySQL

// Objeto que contiene las operaciones relacionadas con la tabla historial_pedidos
const HistorialPedidos = {
  // Obtener todos los registros del historial
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM historial_pedidos");
    return rows;
  },

  // Obtener historial por ID de pedido
  getByPedido: async (id_pedido) => {
    const [rows] = await db.query(
      "SELECT * FROM historial_pedidos WHERE id_pedido = ? ORDER BY fecha_cambio DESC",
      [id_pedido]
    );
    return rows;
  },

  // Crear un nuevo registro en el historial
  create: async (id_pedido, estado_anterior, estado_nuevo, id_usuario) => {
    const [result] = await db.query(
      `INSERT INTO historial_pedidos 
       (id_pedido, estado_anterior, estado_nuevo, id_usuario)
       VALUES (?, ?, ?, ?)`,
      [id_pedido, estado_anterior, estado_nuevo, id_usuario]
    );
    return { id_historial: result.insertId };
  },
};

module.exports = HistorialPedidos;
