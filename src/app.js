// ======================================================================
// Configura middlewares globales y registra las rutas del módulo Productos.
// ======================================================================

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const productoRoutes = require("./routes/producto.routes");

// Crear instancia de Express para la aplicación principal
const app = express();

// Rutas y controladores para el carrito de compras
const carritoRoutes = require("./routes/carrito.routes");

// Middlewares globales en que se aplican a todas las rutas
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Rutas principales que nos traen los endpoints de cada módulo
app.use("/api/productos", productoRoutes);

// Ruta de prueba raíz asi sabemos que el servidor está activo
app.get("/", (req, res) => {
  res.json({ message: "API Feraytek - Servidor activo, Don Señor ARIELO" });
});

// Rutas y controladores para el carrito de compras
app.use("/api/carrito", carritoRoutes);

module.exports = app;
