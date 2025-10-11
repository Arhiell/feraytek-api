/**
 * ===============================================
 * Archivo: server.js
 * Descripción: Punto de entrada del servidor.
 * Lee el puerto del archivo .env y levanta la app.
 * ===============================================
 */

const app = require("./app");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

// Iniciar servidor -- PRUBAS DE SERVIDOR
app.listen(PORT, () => {
  console.log(`OK - Servidor corriendo en http://localhost:${PORT}`);
});
