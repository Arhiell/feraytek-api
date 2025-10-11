// APP PRINCIPAL - Configura middlewares globales y registra las rutas
// ----------------------------------------------------------------------
// Este archivo inicializa Express, aplica middlewares globales
// (CORS, JSON, logging) y registra los módulos del sistema (productos,
// carrito, pedidos, etc.).

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// Rutas principales de los módulos
const productoRoutes = require("./routes/producto.routes");
const carritoRoutes = require("./routes/carrito.routes");
const pedidoRoutes = require("./routes/pedido.routes");

// Inicialización de la aplicación principal
const app = express();

// Middlewares globales (se aplican a todas las rutas)

app.use(cors()); // Habilita CORS (permite solicitudes desde otros dominios)
app.use(express.json()); // Permite recibir y procesar JSON en el cuerpo de las peticiones
app.use(morgan("dev")); // Muestra logs de las solicitudes HTTP en consola (modo desarrollo)

// Registro de rutas principales del sistema
app.use("/api/productos", productoRoutes); // Endpoints de gestión de productos
app.use("/api/carrito", carritoRoutes); // Endpoints del carrito de compras
app.use("/api/pedidos", pedidoRoutes); // Endpoints de pedidos (creación, listado, estado)

// Ruta raíz de prueba (para verificar que el servidor está activo)
app.get("/", (req, res) => {
  res.json({
    message: " API Feraytek - Servidor activo, Don Señor ARIELO ",
  });
});

module.exports = app;
