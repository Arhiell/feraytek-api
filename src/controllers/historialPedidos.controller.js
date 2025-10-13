const HistorialPedidosService = require("../services/historialPedidos.service");

const HistorialPedidosController = {
  // GET /api/historial_pedidos
  listar: async (req, res) => {
    try {
      const data = await HistorialPedidosService.listar();
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // GET /api/historial_pedidos/pedido/:id_pedido
  listarPorPedido: async (req, res) => {
    try {
      const { id_pedido } = req.params;
      const data = await HistorialPedidosService.listarPorPedido(id_pedido);
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // POST /api/historial_pedidos
  registrar: async (req, res) => {
    try {
      const { id_pedido, estado_anterior, estado_nuevo, id_usuario } = req.body;
      const result = await HistorialPedidosService.registrarCambio(
        id_pedido,
        estado_anterior,
        estado_nuevo,
        id_usuario
      );
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = HistorialPedidosController;
