const VariantesProductoService = require("../services/variantesProducto.service");

class VariantesProductoController {
  // Obtener todas las variantes
  static async obtenerTodas(req, res) {
    try {
      const data = await VariantesProductoService.listarTodas();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Obtener variantes por producto
  static async obtenerPorProducto(req, res) {
    try {
      const { id_producto } = req.params;
      const data = await VariantesProductoService.listarPorProducto(
        id_producto
      );
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Crear una nueva variante
  static async crear(req, res) {
    try {
      const result = await VariantesProductoService.crearVariante(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Actualizar una variante
  static async actualizar(req, res) {
    try {
      const { id_variante } = req.params;
      const result = await VariantesProductoService.actualizarVariante(
        id_variante,
        req.body
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Eliminar una variante
  static async eliminar(req, res) {
    try {
      const { id_variante } = req.params;
      const result = await VariantesProductoService.eliminarVariante(
        id_variante
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = VariantesProductoController;
