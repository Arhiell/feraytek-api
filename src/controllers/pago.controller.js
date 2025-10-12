// Este módulo define las funciones que responden a las peticiones HTTP
// relacionadas con los pagos. Se conecta con el servicio PagoService,
// que a su vez interactúa con Mercado Pago y la base de datos MySQL.
// ======================================================================

const pagoService = require("../services/pago.service");

// POST /api/pagos
// Crea una nueva preferencia de pago en Mercado Pago (modo sandbox)
async function crearPago(req, res) {
  try {
    // Extrae los datos enviados desde el cliente
    const { id_pedido, descripcion, monto_total } = req.body;

    // Validación básica de datos
    if (!id_pedido || !monto_total) {
      return res.status(400).json({
        ok: false,
        message: "Debe proporcionar el id_pedido y el monto_total.",
      });
    }

    //Llama al servicio que gestiona la lógica con Mercado Pago
    // Este servicio se encarga de comunicarse con la API de Mercado Pago
    // y devolver el link (sandbox_init_point) junto con el preference_id.
    const resultado = await pagoService.crearPreferenciaPago({
      id_pedido,
      descripcion,
      monto_total,
    });

    //Si el servicio devuelve un resultado no exitoso
    if (!resultado.ok) {
      return res.status(400).json(resultado);
    }

    //  Si todo sale bien, responde con la preferencia creada
    // El resultado incluirá información como:
    // - preference_id
    // - sandbox_init_point (URL de pago de prueba)
    // - datos del pedido asociado

    return res.status(201).json(resultado);
  } catch (error) {
    //Manejo de errores inesperados del servidor
    console.error("Error en crearPago:", error);
    return res.status(500).json({
      ok: false,
      message: "Error interno al crear la preferencia de pago.",
    });
  }
}

// GET /api/pagos
// Devuelve la lista completa de pagos registrados en la base de datos.
async function listarPagos(req, res) {
  try {
    const pagos = await pagoService.obtenerTodosLosPagos();
    return res.status(200).json({
      ok: true,
      data: pagos,
    });
  } catch (error) {
    console.error("Error en listarPagos:", error);
    return res.status(500).json({
      ok: false,
      message: "Error al obtener los pagos.",
    });
  }
}

// GET /api/pagos/:id
// Obtiene el detalle completo de un pago por su ID.
async function obtenerPago(req, res) {
  try {
    //Extrae el parámetro de la ruta
    const { id } = req.params; // ID del pago solicitado
    const pago = await pagoService.obtenerPagoPorId(id);

    //Si no se encontró el pago, devuelve 404 (no encontrado)
    if (!pago) {
      return res.status(404).json({
        ok: false,
        message: "Pago no encontrado.",
      });
    }

    //Si se encuentra el pago, responde con los datos completos
    return res.status(200).json({
      ok: true,
      data: pago,
    });
  } catch (error) {
    //Manejo de errores inesperados DB yconexión,
    console.error("Error en obtenerPago:", error);
    return res.status(500).json({
      ok: false,
      message: "Error al obtener el pago solicitado.",
    });
  }
}

//PUT /api/pagos/:id/estado
// Permite actualizar manualmente el estado de un pago
async function actualizarEstadoPago(req, res) {
  try {
    const { id } = req.params; //  Obtiene el ID del pago desde los parámetros de la URL
    const { estado } = req.body; // Obtiene el nuevo estado enviado en el cuerpo de la solicitud

    // Validación: el campo "estado" es obligatorio
    if (!estado) {
      return res.status(400).json({
        ok: false,
        message: "Debe indicar el nuevo estado del pago.",
      });
    }

    //Llama al servicio encargado de actualizar el registro en la DB
    const resultado = await pagoService.actualizarEstadoPago(id, estado);

    //Respuesta exitosa: estado actualizado correctamente
    return res.status(200).json({
      ok: true,
      message: "Estado del pago actualizado correctamente.",
      data: resultado,
    });
  } catch (error) {
    //Manejo de errores inesperados
    console.error("Error en actualizarEstadoPago:", error);
    return res.status(500).json({
      ok: false,
      message: "Error al actualizar el estado del pago.",
    });
  }
}

//POST /api/pagos/webhook
// Endpoint que recibe notificaciones automáticas desde Mercado Pago.
// Se ejecuta cuando cambia el estado de un pago en modo sandbox.
async function recibirWebhook(req, res) {
  try {
    //Contiene información del evento, ID de transacción, tipo de recurso,
    // y detalles del pago (según la configuración del webhook).
    const data = req.body;

    //El servicio "procesarWebhook" debe analizar el evento recibido,
    // consultar a la API de Mercado Pago
    // y actualizar el estado del pago en la base de datos.
    const resultado = await pagoService.procesarWebhook(data);

    // Mercado Pago espera siempre un status 200 aunque no se procese
    return res.status(200).json(resultado);
  } catch (error) {
    // Manejo de errores inesperados durante el procesamiento del webhook
    console.error("Error en recibirWebhook:", error);
    return res.status(500).json({
      ok: false,
      message: "Error al procesar el webhook.",
    });
  }
}

module.exports = {
  crearPago,
  listarPagos,
  obtenerPago,
  actualizarEstadoPago,
  recibirWebhook,
};
