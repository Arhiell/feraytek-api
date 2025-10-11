/**
 * =============================================
 * Archivo: app.js
 * Descripción: Configura la aplicación Express con
 * middlewares globales, rutas y seguridad.
 * ===============================================
 */

// Importar dependencias para configurar el servidor
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const app = express();

// Middlewares globales
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Ruta de prueba inicial solo es de prueba si funciona todo OK
app.get("/", (req, res) => {
  res.send("🚀 API Feraytek funcionando correctamente.");
});

// Exportar la instancia de la app para ser usada en server.js
module.exports = app;
