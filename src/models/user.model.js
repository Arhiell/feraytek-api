// ======================================================================
// Modelo de Usuario
// Responsable de interactuar directamente con la base de datos MySQL.
// Contiene las operaciones CRUD sobre la tabla "usuarios".
// ======================================================================

// Conexión al pool MySQL
const pool = require("../config/database");
const bcrypt = require('bcryptjs');

// ----------------------------------------------------------------------
// Obtener todos los usuarios (solo para administradores)
// ----------------------------------------------------------------------
async function getAll() {
  const [rows] = await pool.query(`
    SELECT id_usuario, nombre_usuario, email, rol, estado, fecha_registro, ultimo_login
    FROM usuarios
    ORDER BY id_usuario DESC
  `);
  return rows;
}

// ----------------------------------------------------------------------
// Obtener un usuario específico por su ID
// ----------------------------------------------------------------------
async function getById(id) {
  const [rows] = await pool.query(
    `
    SELECT id_usuario, nombre_usuario, email, rol, estado, fecha_registro, ultimo_login
    FROM usuarios
    WHERE id_usuario = ?
    `,
    [id]
  );
  return rows[0];
}

// ----------------------------------------------------------------------
// Obtener un usuario por su email (para login)
// ----------------------------------------------------------------------
async function getByEmail(email) {
  const [rows] = await pool.query(
    `
    SELECT *
    FROM usuarios
    WHERE email = ?
    `,
    [email]
  );
  return rows[0];
}

// ----------------------------------------------------------------------
// Obtener un usuario por su nombre de usuario
// ----------------------------------------------------------------------
async function getByUsername(nombreUsuario) {
  const [rows] = await pool.query(
    `
    SELECT *
    FROM usuarios
    WHERE nombre_usuario = ?
    `,
    [nombreUsuario]
  );
  return rows[0];
}

// ----------------------------------------------------------------------
// Crear un nuevo usuario (registro)
// ----------------------------------------------------------------------
async function create(userData) {
  const { nombre_usuario, email, password } = userData;
  
  // Generar hash de la contraseña
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  
  // Por defecto, los nuevos usuarios son clientes
  const rol = userData.rol || 'cliente';
  const estado = userData.estado || 'activo';
  
  const [result] = await pool.query(
    `
    INSERT INTO usuarios (nombre_usuario, email, password_hash, rol, estado, fecha_registro)
    VALUES (?, ?, ?, ?, ?, NOW())
    `,
    [nombre_usuario, email, hashedPassword, rol, estado]
  );
  
  return { id_usuario: result.insertId };
}

// ----------------------------------------------------------------------
// Actualizar un usuario existente
// ----------------------------------------------------------------------
async function update(id, userData) {
  const { nombre_usuario, email, estado } = userData;
  
  const [result] = await pool.query(
    `
    UPDATE usuarios
    SET 
      nombre_usuario = COALESCE(?, nombre_usuario), 
      email = COALESCE(?, email), 
      estado = COALESCE(?, estado)
    WHERE id_usuario = ?
    `,
    [
      nombre_usuario ?? null,
      email ?? null,
      estado ?? null,
      id
    ]
  );
  
  return result.affectedRows > 0;
}

// ----------------------------------------------------------------------
// Actualizar contraseña de usuario
// ----------------------------------------------------------------------
async function updatePassword(id, newPassword) {
  // Generar hash de la nueva contraseña
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  
  const [result] = await pool.query(
    `
    UPDATE usuarios
    SET password_hash = ?
    WHERE id_usuario = ?
    `,
    [hashedPassword, id]
  );
  
  return result.affectedRows > 0;
}

// ----------------------------------------------------------------------
// Actualizar último login
// ----------------------------------------------------------------------
async function updateLastLogin(id) {
  await pool.query(
    `
    UPDATE usuarios
    SET ultimo_login = NOW()
    WHERE id_usuario = ?
    `,
    [id]
  );
}

// ----------------------------------------------------------------------
// Cambiar estado de usuario (activo/inactivo) - solo para administradores
// ----------------------------------------------------------------------
async function remove(id) {
  // Primero obtener el estado actual del usuario
  const [currentUser] = await pool.query(
    `SELECT estado FROM usuarios WHERE id_usuario = ?`,
    [id]
  );
  
  if (currentUser.length === 0) {
    return false; // Usuario no encontrado
  }
  
  // Cambiar el estado: si está activo lo pone inactivo, y viceversa
  const nuevoEstado = currentUser[0].estado === 'activo' ? 'inactivo' : 'activo';
  
  const [result] = await pool.query(
    `
    UPDATE usuarios 
    SET estado = ?
    WHERE id_usuario = ?
    `,
    [nuevoEstado, id]
  );
  
  return result.affectedRows > 0;
}

module.exports = {
  getAll,
  getById,
  getByEmail,
  getByUsername,
  create,
  update,
  updatePassword,
  updateLastLogin,
  remove
};