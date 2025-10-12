const Factura = require("../models/factura.model");

class FacturaService {
  // Obtener todas las facturas
  static async listarTodas() {
    return await Factura.obtenerTodas();
  }

  //  Obtener factura por ID
  static async obtenerPorId(id) {
    const factura = await Factura.obtenerPorId(id);
    if (!factura) throw new Error("Factura no encontrada");
    return factura;
  }

  // Crear nueva factura
  static async crearFactura(data) {
    if (!data.id_pedido || !data.id_usuario || !data.total) {
      throw new Error("Datos insuficientes para generar la factura");
    }
    return await Factura.crear(data);
  }

  //  Marcar factura como enviada por email
  static async marcarComoEnviada(id) {
    const actualizado = await Factura.marcarComoEnviado(id);
    if (!actualizado) throw new Error("No se pudo marcar como enviada");
    return { ok: true, message: "Factura marcada como enviada" };
  }
}

module.exports = FacturaService;
