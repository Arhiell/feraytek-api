// ======================================================================
// Responsable de las operaciones SQL sobre las tablas:
// - pedidos
// - pedido_detalle
// Se comunica con la base de datos MySQL mediante 'pool'.
// ======================================================================

const pool = require("../config/database");

// Crear nuevo pedido
// Recibe los datos del usuario, subtotal, descuentos, costo de envío, total
// y devuelve el ID del nuevo pedido creado.

async function crearPedido({
  id_usuario,
  subtotal,
  descuento_total,
  costo_envio,
  total,
  metodo_entrega,
  notas,
}) {
  // Ejecuta una consulta SQL para insertar un nuevo registro en la tabla "pedidos"
  const [result] = await pool.query(
    `INSERT INTO pedidos (id_usuario, subtotal, descuento_total, costo_envio, total, metodo_entrega, notas)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      id_usuario,
      subtotal,
      descuento_total,
      costo_envio,
      total,
      metodo_entrega,
      notas || null, // Observaciones opcionales (se guarda null si no hay)
    ]
  );
  return result.insertId;
}

// Insertar detalle del pedido
// Registra cada línea del pedido (producto, cantidad, precios, IVA).

// Función asíncrona para agregar los ítems (detalles) de un pedido con manejo de errores
async function agregarDetalle(id_pedido, items) {
  try {
    // Recorre cada producto dentro del array "items"
    for (const item of items) {
      // Inserta cada detalle en la tabla "pedido_detalle"
      await pool.query(
        `INSERT INTO pedido_detalle 
         (id_pedido, id_producto, id_variante, cantidad, precio_unitario, iva_porcentaje, iva_monto)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          id_pedido,
          item.id_producto,
          item.id_variante,
          item.cantidad,
          item.precio_unitario,
          item.iva_porcentaje,
          item.iva_monto,
        ]
      );
    }

    // Si todo se ejecutó correctamente, devuelve true
    return true;
  } catch (error) {
    // Muestra el error en consola para depuración
    console.error("Error al insertar detalle del pedido:", error);

    // Lanza el error para que pueda ser manejado por el controlador superior
    throw new Error("No se pudo agregar el detalle del pedido.");
  }
}

// Obtener listado de pedidos por usuario
// Incluye datos básicos: id, total, estado, fecha.

// Función asíncrona para listar los pedidos de un usuario con sus detalles
async function listarPedidosPorUsuario(id_usuario) {
  try {
    // Consulta principal: obtiene todos los pedidos del usuario
    const [pedidos] = await pool.query(
      `SELECT 
         p.id_pedido,
         p.fecha_pedido,
         p.total,
         p.estado,
         p.metodo_entrega
       FROM pedidos AS p
       WHERE p.id_usuario = ?
       ORDER BY p.fecha_pedido DESC`,
      [id_usuario]
    );

    // Para cada pedido, obtener sus productos asociados
    for (const pedido of pedidos) {
      const [detalles] = await pool.query(
        `SELECT 
           d.id_detalle,
           d.id_producto,
           pr.nombre AS nombre_producto,
           d.cantidad,
           d.precio_unitario,
           d.iva_porcentaje,
           d.iva_monto
         FROM pedido_detalle AS d
         JOIN productos AS pr ON d.id_producto = pr.id_producto
         WHERE d.id_pedido = ?`,
        [pedido.id_pedido]
      );

      // Agrega el array de detalles a cada pedido
      pedido.detalles = detalles;
    }

    // Devuelve todos los pedidos con sus detalles incluidos
    return pedidos;
  } catch (error) {
    console.error("Error al listar pedidos del usuario:", error);
    throw new Error("No se pudieron obtener los pedidos del usuario.");
  }
}

// Obtener detalle completo de un pedido específico
// Devuelve los ítems asociados, con nombres de productos y variantes.
async function obtenerDetallePedido(id_pedido) {
  // Consulta SQL que une los detalles del pedido con los nombres de productos y variantes
  const [rows] = await pool.query(
    `SELECT pd.*, p.nombre AS producto, v.valor AS variante, v.atributo
     FROM pedido_detalle pd
     INNER JOIN productos p ON pd.id_producto = p.id_producto
     LEFT JOIN variantes_producto v ON pd.id_variante = v.id_variante
     WHERE pd.id_pedido = ?`,
    [id_pedido]
  );
  // Devuelve un arreglo con los ítems del pedido
  return rows;
}

// Actualizar estado del pedido (por ejemplo: 'pagado', 'enviado', 'cancelado', etc.)
async function actualizarEstado(id_pedido, nuevoEstado) {
  // Ejecuta una consulta SQL para actualizar el estado del pedido
  await pool.query(
    `UPDATE pedidos 
     SET estado = ?,                -- Nuevo estado del pedido
         updated_at = CURRENT_TIMESTAMP  -- Actualiza la fecha de modificación
     WHERE id_pedido = ?`,
    [nuevoEstado, id_pedido]
  );

  // Devuelve true si la operación se realizó correctamente
  return true;
}

module.exports = {
  crearPedido,
  agregarDetalle,
  listarPedidosPorUsuario,
  obtenerDetallePedido,
  actualizarEstado,
};
