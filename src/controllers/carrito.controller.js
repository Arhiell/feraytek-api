// ======================================================================
// Recibe las peticiones HTTP y responde en formato JSON.
// Utiliza los servicios de CarritoService.
// ======================================================================

const CarritoService = require("../services/carrito.service");

// ----------------------------------------------------------------------
// GET /api/carrito
// ----------------------------------------------------------------------

// Listar los items del carrito de un usuario
async function listar(req, res) {
  // Capture el error si el servicio falla
  try {
    // Por ahora, el id_usuario es fijo (1) hasta que implementemos autenticación por token
    const id_usuario = req.body.id_usuario || 1;

    // Llamar al servicio para listar los items del carrito
    const items = await CarritoService.listarItems(id_usuario);
    // Retornar la respuesta con los items de un 200 OK
    res.status(200).json({
      ok: true,
      data: items,
    });
  } catch (error) {
    // Retornar un error 400 Bad Request con el mensaje del error
    res.status(400).json({
      ok: false,
      message: error.message,
    });
  }
}

// ----------------------------------------------------------------------
// POST /api/carrito
// ----------------------------------------------------------------------
// Capturamos los errores a la hora de agregar un producto al carrito
async function agregar(req, res) {
  try {
    // Por ahora, el id_usuario es fijo (1) hasta que implementemos autenticación por token
    const id_usuario = req.body.id_usuario || 1;

    // Llamar al servicio para agregar el producto al carrito
    //Medianre el req.body recibimos
    const resultado = await CarritoService.agregarProductoAlCarrito(
      id_usuario,
      req.body
    );

    // Retornar la respuesta con el resultado de la operación
    res
      // Reportar un 201 Created si se agregó correctamente
      .status(201)
      .json({
        ok: true,
        // Mensaje del servicio (producto agregado o cantidad actualizada)
        message: resultado.message,
        // Devolver el id del carrito
        carrito_id: resultado.carrito_id,
      });
  } catch (error) {
    // Retornar un error 400 Bad Request con el mensaje del error
    res.status(400).json({
      ok: false,
      message: error.message,
    });
  }
}

// ----------------------------------------------------------------------
// DELETE /api/carrito/item
// ----------------------------------------------------------------------

// Capturamos los errores a la hora de eliminar un producto del carrito
async function eliminar(req, res) {
  try {
    // Por ahora, el id_usuario es fijo (1) hasta que implementemos autenticación por token
    const id_usuario = req.body.id_usuario || 1;
    // Recibir id_producto e id_variante desde el body
    const { id_producto, id_variante } = req.body;

    // Llamar al servicio para eliminar el producto del carrito
    await CarritoService.eliminarProducto(id_usuario, id_producto, id_variante);
    // Retornar la respuesta con un 200 OK
    res
      .status(200)
      .json({ ok: true, message: "Producto eliminado correctamente" });
  } catch (error) {
    // Error 400 Bad Request con el mensaje del error
    res.status(400).json({
      ok: false,
      message: error.message,
    });
  }
}

// ----------------------------------------------------------------------
// DELETE /api/carrito
// ----------------------------------------------------------------------

// Capturamos los errores a la hora de vaciar el carrito
async function vaciar(req, res) {
  try {
    const id_usuario = req.body.id_usuario || 1;
    // Llamar al servicio para vaciar el carrito
    await CarritoService.vaciar(id_usuario);
    // Retornar la respuesta con un 200 OK
    res.status(200).json({
      ok: true,
      message: "Carrito vaciado correctamente",
    });
  } catch (error) {
    // Error 400 Bad Request con el mensaje del error
    res.status(400).json({
      ok: false,
      message: error.message,
    });
  }
}

// Exportar las funciones del controlador
module.exports = {
  listar,
  agregar,
  eliminar,
  vaciar,
};
