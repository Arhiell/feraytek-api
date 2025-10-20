// ======================================================================
// Modelo de Administrador
// Responsable de interactuar directamente con la base de datos MySQL.
// Contiene las operaciones CRUD sobre la tabla "administradores".
// ======================================================================

// Conexión al pool MySQL
const pool = require("../config/database");

// ----------------------------------------------------------------------
// Obtener todos los administradores
// ----------------------------------------------------------------------
async function getAll() {
  const [rows] = await pool.query(`
    SELECT a.*, u.email, u.nombre_usuario, u.estado
    FROM administradores a
    INNER JOIN usuarios u ON a.id_usuario = u.id_usuario
    ORDER BY a.id_admin DESC
  `);
  return rows;
}

// ----------------------------------------------------------------------
// Obtener un administrador específico por su ID
// ----------------------------------------------------------------------
async function getById(id) {
  const [rows] = await pool.query(
    `
    SELECT a.*, u.email, u.nombre_usuario, u.estado
    FROM administradores a
    INNER JOIN usuarios u ON a.id_usuario = u.id_usuario
    WHERE a.id_admin = ?
    `,
    [id]
  );
  return rows[0];
}

// ----------------------------------------------------------------------
// Obtener un administrador por ID de usuario
// ----------------------------------------------------------------------
async function getByUserId(userId) {
  const [rows] = await pool.query(
    `
    SELECT a.*, u.email, u.nombre_usuario, u.estado
    FROM administradores a
    INNER JOIN usuarios u ON a.id_usuario = u.id_usuario
    WHERE a.id_usuario = ?
    `,
    [userId]
  );
  return rows[0];
}

// ----------------------------------------------------------------------
// Crear un nuevo perfil de administrador
// ----------------------------------------------------------------------
async function create(adminData) {
  const { 
    id_usuario, 
    dni, 
    nombre, 
    apellido, 
    telefono, 
    cargo 
  } = adminData;
  
  const [result] = await pool.query(
    `
    INSERT INTO administradores (
      id_usuario, 
      dni, 
      nombre, 
      apellido, 
      telefono, 
      cargo
    )
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      id_usuario, 
      dni, 
      nombre, 
      apellido, 
      telefono, 
      cargo
    ]
  );
  
  return { id_admin: result.insertId };
}

// ----------------------------------------------------------------------
// Actualizar un perfil de administrador existente
// ----------------------------------------------------------------------
async function update(id, adminData) {
  const { 
    dni, 
    nombre, 
    apellido, 
    telefono, 
    cargo 
  } = adminData;
  
  const [result] = await pool.query(
    `
    UPDATE administradores
    SET 
      dni = ?, 
      nombre = ?, 
      apellido = ?, 
      telefono = ?, 
      cargo = ?
    WHERE id_admin = ?
    `,
    [
      dni, 
      nombre, 
      apellido, 
      telefono, 
      cargo,
      id
    ]
  );
  
  return result.affectedRows > 0;
}

// ----------------------------------------------------------------------
// Eliminar un perfil de administrador
// ----------------------------------------------------------------------
async function remove(id) {
  const [result] = await pool.query(
    `
    DELETE FROM administradores
    WHERE id_admin = ?
    `,
    [id]
  );
  
  return result.affectedRows > 0;
}

module.exports = {
  getAll,
  getById,
  getByUserId,
  create,
  update,
  remove
};