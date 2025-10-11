/**
 * ===============================================
 * Archivo: database.js
 * Descripción: Configura la conexión al servidor MySQL
 * utilizando mysql2 con variables de entorno (.env). No olvidar LEO DEBERAS CREAR ESTE ARCHIVO PARA NO SUBIR
 *  TUS DATOS SENCIBLES AL REPOSITORIO
 * ===============================================
 */

const mysql = require("mysql2/promise");
require("dotenv").config();

// Crear pool de conexiones (permite manejar múltiples queries simultáneamente)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
});

// Sirve para verificar que las variables de entorno se están leyendo correctamente
console.log(
  "🧪 Variables de entorno cargadas:",
  process.env.DB_USER,
  process.env.DB_NAME
);

// Exportar el pool para usarlo en modelos y servicios
module.exports = pool;
