// Contiene la lógica de negocio para la gestión de pagos,
// conectando la base de datos MySQL (modelo Pago) con la API de Mercado Pago.
// Se encarga de crear preferencias, procesar respuestas y actualizar estados.

const { MercadoPagoConfig, Preference } = require("mercadopago");
const pagoModel = require("../models/pago.model");
const pedidoModel = require("../models/pedido.model"); // opcional

require("dotenv").config();

// Configuración del SDK de Mercado Pago
const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
  options: { timeout: 5000 },
});

// Crear preferencia de pago (modo sandbox)
// ----------------------------------------------------------------------
// Recibe la información del pedido y crea una preferencia (objeto de pago)
// en el entorno de prueba (sandbox). Devuelve el link simulado de pago.
async function crearPreferenciaPago({ id_pedido, descripcion, monto_total }) {
  try {
    // Validamos que no exista un pago previo
    const pagoExistente = await pagoModel.obtenerPagoPorPedido(id_pedido);
    if (pagoExistente) {
      throw new Error("Ya existe un pago asociado a este pedido.");
    }

    // Configuración de la preferencia para Mercado Pago
    const preference = {
      items: [
        {
          title: descripcion || `Pedido #${id_pedido}`,
          quantity: 1,
          currency_id: "ARS",
          unit_price: parseFloat(monto_total),
        },
      ],
      back_urls: {
        success: "http://localhost:3000/pago/success",
        failure: "http://localhost:3000/pago/failure", 
        pending: "http://localhost:3000/pago/pending",
      },
      notification_url: "http://localhost:3000/api/pagos/webhook", // Webhook local (modo sandbox)
      binary_mode: true, // El pago se aprueba o rechaza automáticamente
    };

    // Se crea la preferencia en Mercado Pago (SDK v2)
    const preferenceInstance = new Preference(mpClient);
    const response = await preferenceInstance.create({ body: preference });

    const id_transaccion = response.id;
    const raw_gateway_json = response;

    // Guardamos el registro en la base de datos
    const id_pago = await pagoModel.crearPago({
      id_pedido,
      metodo_pago: "mercado_pago",
      monto: monto_total,
      id_transaccion,
      raw_gateway_json,
    });

    // Respuesta al cliente
    return {
      ok: true,
      message: "Preferencia de pago creada correctamente (sandbox).",
      data: {
        id_pago,
        id_pedido,
        id_transaccion,
        estado_pago: "pendiente",
        link_pago: response.init_point,
        link_sandbox: response.sandbox_init_point,
      },
    };
  } catch (error) {
    console.error("Error al crear la preferencia de pago:", error);
    return {
      ok: false,
      message: error.message,
    };
  }
}

// Procesar notificación del Webhook (callback de Mercado Pago)
// ----------------------------------------------------------------------
// Mercado Pago llama automáticamente a este endpoint cuando cambia el
// estado de un pago. Actualiza el registro en la tabla `pagos`.
async function procesarWebhook(data) {
  try {
    const { data: webhookData } = data;
    const id_transaccion = webhookData?.id || null;

    if (!id_transaccion)
      throw new Error("Webhook sin ID de transacción válido.");

    // Se busca el pago correspondiente en la base de datos usando el id_transaccion
    const pagoEncontrado = await pagoModel.obtenerPagoPorTransaccion(id_transaccion);

    if (!pagoEncontrado) {
      console.warn("Webhook recibido pero no se encontró el pago asociado.");
      return { ok: false, message: "Pago no encontrado en la base de datos." };
    }

    // Determinar nuevo estado - mapear estados de Mercado Pago a nuestros estados
    let nuevoEstado = "pendiente";
    const statusFromWebhook = data?.status || webhookData?.status;
    
    if (statusFromWebhook === "approved") {
      nuevoEstado = "aprobado";
    } else if (statusFromWebhook === "rejected") {
      nuevoEstado = "rechazado";
    } else if (statusFromWebhook === "cancelled") {
      nuevoEstado = "cancelado";
    }

    // Actualizar estado del pago
    await pagoModel.actualizarEstadoPago(pagoEncontrado.id_pago, nuevoEstado);

    // Registrar datos crudos del webhook
    await pagoModel.registrarWebhook(pagoEncontrado.id_pago, data);

    return { ok: true, message: "Webhook procesado correctamente." };
  } catch (error) {
    console.error("Error procesando webhook:", error);
    return { ok: false, message: error.message };
  }
}

// Consultar pagos registrados
async function obtenerTodosLosPagos() {
  const pagos = await pagoModel.listarPagos();
  return pagos;
}

// Obtener detalle de un pago por ID
async function obtenerPagoPorId(id_pago) {
  const pago = await pagoModel.obtenerPagoPorId(id_pago);
  if (!pago) throw new Error("Pago no encontrado.");
  return pago;
}

// Actualizar estado de pago (manual o administrativo)
async function actualizarEstadoPago(id_pago, estado) {
  return await pagoModel.actualizarEstadoPago(id_pago, estado);
}

// ======================================================================
// EXPORTACIÓN DE FUNCIONES
// ======================================================================
module.exports = {
  crearPreferenciaPago,
  procesarWebhook,
  obtenerTodosLosPagos,
  obtenerPagoPorId,
  actualizarEstadoPago,
};
