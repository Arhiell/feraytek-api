// ======================================================================
// Aplica la lógica de negocio sobre pedidos:
// - Generación desde el carrito
// - Cálculo de subtotal, IVA y total
// - Creación del pedido y detalle
// - Cambio de estado
// ======================================================================

const Pedido = require("../models/pedido.model");
const Carrito = require("../models/carrito.model");
const pool = require("../config/database");

// Crear pedido a partir del carrito activo
async function crearPedidoDesdeCarrito(
  id_usuario,
  metodo_entrega = "envio_domicilio", // Valor por defecto
  costo_envio = 0,
  notas = null
) {
  // Obtener carrito activo
  const carrito = await Carrito.getCarritoActivo(id_usuario);
  if (!carrito)
    //En el acaso arroja error
    throw new Error("No hay carrito activo para generar el pedido.");

  // obtener ítems del carrito
  const items = await Carrito.getItems(carrito.id_carrito);
  if (items.length === 0) throw new Error("El carrito está vacío.");

  // Calcular totales
  let subtotal = 0;
  for (const item of items) {
    subtotal += item.precio_unitario * item.cantidad;
  }

  const descuento_total = 0; // Se implementará en módulo de descuentos
  const total = subtotal - descuento_total + costo_envio;

  // Crear pedido en tabla principal
  const id_pedido = await Pedido.crearPedido({
    id_usuario,
    subtotal,
    descuento_total,
    costo_envio,
    total,
    metodo_entrega,
    notas,
  });

  // Insertar detalles de cada producto del carrito
  await Pedido.agregarDetalle(id_pedido, items);

  // Vaciar carrito luego de crear pedido
  await Carrito.vaciarCarrito(carrito.id_carrito);

  return { id_pedido, total, cantidad_items: items.length };
}

// Listar pedidos de un usuario
async function listarPedidos(id_usuario) {
  return await Pedido.listarPedidosPorUsuario(id_usuario);
}

// Obtener pedido con su detalle
async function obtenerPedidoCompleto(id_pedido) {
  const [pedidoData] = await pool.query(
    // Consulta el pedido principal por su ID
    "SELECT * FROM pedidos WHERE id_pedido = ?",
    [id_pedido]
  );

  // Si no se encontró ningún pedido, lanza un error controlad
  if (pedidoData.length === 0) throw new Error("Pedido no encontrado.");

  // Obtiene el detalle del pedido
  const detalle = await Pedido.obtenerDetallePedido(id_pedido);

  // Retorna un objeto con el pedido principal y su detalle asociado
  return {
    pedido: pedidoData[0], // Información del pedido
    detalle, // Lista de productos asociados
  };
}

// Cambiar estado del pedido
async function cambiarEstado(id_pedido, nuevoEstado) {
  await Pedido.actualizarEstado(id_pedido, nuevoEstado);
  return {
    // Retorna un mensaje de confirmación para el frontend o controlador
    message: `Estado del pedido #${id_pedido} actualizado a '${nuevoEstado}'.`,
  };
}

// Exportación de funciones del módulo Pedido
module.exports = {
  crearPedidoDesdeCarrito,
  listarPedidos,
  obtenerPedidoCompleto,
  cambiarEstado,
};
