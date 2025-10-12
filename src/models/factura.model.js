const db = require("../config/database");

class Factura {
  // Obtener todas las facturas del sistema
  static async obtenerTodas() {
    const sql = `
      SELECT f.*, u.nombre_usuario, p.metodo_pago
      FROM facturas f
      JOIN usuarios u ON f.id_usuario = u.id_usuario
      LEFT JOIN pagos p ON f.id_pago = p.id_pago
      ORDER BY f.fecha_emision DESC
    `;
    const [rows] = await db.execute(sql);
    return rows;
  }

  // Obtener una factura por su ID
  static async obtenerPorId(id) {
    const sql = `
      SELECT f.*, u.nombre_usuario, p.metodo_pago
      FROM facturas f
      JOIN usuarios u ON f.id_usuario = u.id_usuario
      LEFT JOIN pagos p ON f.id_pago = p.id_pago
      WHERE f.id_factura = ?
    `;
    const [rows] = await db.execute(sql, [id]);
    return rows[0];
  }

  // Crear una nueva factura
  static async crear(datos) {
    const {
      numero_factura,
      id_pedido,
      id_pago,
      id_usuario,
      tipo,
      subtotal,
      iva_total,
      total,
      pdf_url,
    } = datos;

    const sql = `
      INSERT INTO facturas (
        numero_factura, id_pedido, id_pago, id_usuario,
        tipo, subtotal, iva_total, total, pdf_url
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [
      numero_factura,
      id_pedido,
      id_pago,
      id_usuario,
      tipo,
      subtotal,
      iva_total,
      total,
      pdf_url || null,
    ]);

    return { id_factura: result.insertId, ...datos };
  }

  // Actualizar el estado de envío por correo
  static async marcarComoEnviado(id) {
    const sql = `
      UPDATE facturas
      SET enviado_email = 1, updated_at = NOW()
      WHERE id_factura = ?
    `;
    const [result] = await db.execute(sql, [id]);
    return result.affectedRows > 0;
  }

}

module.exports = Factura;
