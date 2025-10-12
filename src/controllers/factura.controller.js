const FacturaService = require("../services/factura.service");

class FacturaController {
  static async obtenerTodas(req, res) {
    try {
      const facturas = await FacturaService.listarTodas();
      res.status(200).json(facturas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async obtenerPorId(req, res) {
    try {
      const factura = await FacturaService.obtenerPorId(req.params.id);
      res.status(200).json(factura);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async crear(req, res) {
    try {
      const nuevaFactura = await FacturaService.crearFactura(req.body);
      res.status(201).json(nuevaFactura);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async marcarEnviada(req, res) {
    try {
      const result = await FacturaService.marcarComoEnviada(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = FacturaController;
