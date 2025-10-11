// ======================================================================
// Gestiona las peticiones HTTP de pedidos:
// - Crear pedido desde carrito
// - Listar pedidos
// - Consultar detalle
// - Actualizar estado
// ======================================================================

const PedidoService = require("../services/pedido.service");

// ----------------------------------------------------------------------
// POST /api/pedidos
// Crea un pedido a partir del carrito del usuario
// ----------------------------------------------------------------------
async function crearDesdeCarrito(req, res) {
  try {
    // Extrae datos de la solicitud
    const id_usuario = req.body.id_usuario || 1; // valor por defecto (temporal)
    const { metodo_entrega, costo_envio, notas } = req.body;

    // Llama al servicio para generar el pedido completo
    const pedido = await PedidoService.crearPedidoDesdeCarrito(
      id_usuario,
      metodo_entrega,
      costo_envio,
      notas
    );

    // Devuelve respuesta con código 201 (creado)
    res
      .status(201)
      .json({ ok: true, message: "Pedido creado correctamente", data: pedido });
  } catch (error) {
    //Error controlado en caso por mala solicitud
    res.status(400).json({
      ok: false,
      message: error.message,
    });
  }
}

// ----------------------------------------------------------------------
// GET /api/pedidos
// Lista todos los pedidos de un usuario
// ----------------------------------------------------------------------
async function listar(req, res) {
  try {
    const id_usuario = req.query.id_usuario || 1;
    const pedidos = await PedidoService.listarPedidos(id_usuario);
    res.status(200).json({ ok: true, data: pedidos });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
}

// ----------------------------------------------------------------------
// GET /api/pedidos/:id
// Devuelve detalle completo del pedido
// ----------------------------------------------------------------------
async function detalle(req, res) {
  try {
    const id_pedido = req.params.id;
    // Llama al servicio para obtener pedido + ítems
    const pedido = await PedidoService.obtenerPedidoCompleto(id_pedido);
    res.status(200).json({
      ok: true,
      data: pedido,
    });
  } catch (error) {
    // Error 404 si el pedido no existe
    res.status(404).json({
      ok: false,
      message: error.message,
    });
  }
}

// ----------------------------------------------------------------------
// PUT /api/pedidos/:id/estado
// Actualiza el estado del pedido (admin)
// ----------------------------------------------------------------------
async function actualizarEstado(req, res) {
  try {
    const id_pedido = req.params.id;
    const { estado } = req.body;
    const resultado = await PedidoService.cambiarEstado(id_pedido, estado);
    res.status(200).json({ ok: true, message: resultado.message });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
}

// Exporta las funciones del controlador para las rutas
module.exports = {
  crearDesdeCarrito,
  listar,
  detalle,
  actualizarEstado,
};
