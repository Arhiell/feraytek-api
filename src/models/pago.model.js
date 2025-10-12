// Este módulo gestiona las operaciones SQL relacionadas con la tabla `pagos`,
// incluyendo la creación de nuevos pagos, la obtención de registros y la
// actualización del estado de un pago existente.

const pool = require("../config/database");

// Crear un nuevo pago (inicialmente en estado "pendiente"):
// Recibe los datos del pedido y el monto total, junto con la preferencia
// generada por Mercado Pago (sandbox_init_point y preference_id).
// Se inserta un registro en la tabla `pagos` asociado al `id_pedido`.
// ----------------------------------------------------------------------
async function crearPago({
  id_pedido,
  metodo_pago,
  monto,
  id_transaccion,
  raw_gateway_json,
}) {
  const [result] = await pool.query(
    `INSERT INTO pagos (id_pedido, metodo_pago, monto, id_transaccion, raw_gateway_json)
     VALUES (?, ?, ?, ?, ?)`,
    [
      id_pedido,
      metodo_pago,
      monto,
      id_transaccion,
      JSON.stringify(raw_gateway_json),
    ]
  );

  return result.insertId; // Devuelve el ID del nuevo pago
}

// Listar todos los pagos registrados:
// Retorna un listado con información básica:
async function listarPagos() {
  const [rows] = await pool.query(
    `SELECT id_pago, id_pedido, metodo_pago, monto, estado_pago, fecha_pago
     FROM pagos ORDER BY created_at DESC`
  );
  return rows;
}

// Obtener el detalle completo de un pago específico
// Incluye el JSON completo del gateway para auditoría.
async function obtenerPagoPorId(id_pago) {
  const [rows] = await pool.query(`SELECT * FROM pagos WHERE id_pago = ?`, [
    id_pago,
  ]);
  return rows[0];
}

// Actualizar el estado de un pago
// Cambia el campo `estado_pago` según la respuesta del gateway.
// También actualiza la fecha de pago si el estado es "aprobado".
async function actualizarEstadoPago(id_pago, nuevoEstado) {
  const fechaPago = nuevoEstado === "aprobado" ? new Date() : null;

  await pool.query(
    `UPDATE pagos
     SET estado_pago = ?, fecha_pago = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id_pago = ?`,
    [nuevoEstado, fechaPago, id_pago]
  );

  return { id_pago, estado_pago: nuevoEstado };
}

// Buscar un pago por su ID de pedido
// Permite verificar si un pedido ya tiene un pago asociado (1:1).
async function obtenerPagoPorPedido(id_pedido) {
  const [rows] = await pool.query(`SELECT * FROM pagos WHERE id_pedido = ?`, [
    id_pedido,
  ]);
  return rows[0];
}

// Actualizar datos crudos del gateway (webhook callback)
// Guarda la respuesta completa del webhook de Mercado Pago en formato JSON.
async function registrarWebhook(id_pago, raw_gateway_json) {
  await pool.query(
    `UPDATE pagos
     SET raw_gateway_json = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id_pago = ?`,
    [JSON.stringify(raw_gateway_json), id_pago]
  );
  return true;
}

module.exports = {
  crearPago,
  listarPagos,
  obtenerPagoPorId,
  actualizarEstadoPago,
  obtenerPagoPorPedido,
  registrarWebhook,
};
