// ======================================================================
// Servicio de Usuario
// Contiene la lógica de negocio relacionada con usuarios y autenticación
// ======================================================================

const userModel = require('../models/user.model');
const clienteModel = require('../models/cliente.model');
const adminModel = require('../models/admin.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Clave secreta para JWT (debería estar en variables de entorno)
const JWT_SECRET = process.env.JWT_SECRET || 'feraytek-secret-key';

// ----------------------------------------------------------------------
// Obtener todos los usuarios (solo para administradores)
// ----------------------------------------------------------------------
async function getAllUsers() {
  return await userModel.getAll();
}

// ----------------------------------------------------------------------
// Obtener un usuario por ID
// ----------------------------------------------------------------------
async function getUserById(id) {
  const user = await userModel.getById(id);
  if (!user) {
    throw createError('Usuario no encontrado', 404);
  }
  return user;
}

// ----------------------------------------------------------------------
// Registrar un nuevo usuario cliente
// ----------------------------------------------------------------------
async function registerCliente(userData, clienteData) {
  // Verificar si el email ya existe
  const existingUserByEmail = await userModel.getByEmail(userData.email);
  if (existingUserByEmail) {
    throw createError('El email ya está registrado', 409);
  }
  
  // Verificar si el nombre de usuario ya existe
  const existingUserByUsername = await userModel.getByUsername(userData.nombre_usuario);
  if (existingUserByUsername) {
    throw createError('El nombre de usuario ya está registrado', 409);
  }
  
  // Crear el usuario con rol cliente
  userData.rol = 'cliente';
  const result = await userModel.create(userData);
  
  // Crear el perfil de cliente
  clienteData.id_usuario = result.id_usuario;
  await clienteModel.create(clienteData);
  
  return { id_usuario: result.id_usuario };
}

// ----------------------------------------------------------------------
// Registrar un nuevo usuario administrador
// ----------------------------------------------------------------------
async function registerAdmin(userData, adminData) {
  // Verificar si el email ya existe
  const existingUserByEmail = await userModel.getByEmail(userData.email);
  if (existingUserByEmail) {
    throw createError('El email ya está registrado', 409);
  }
  
  // Verificar si el nombre de usuario ya existe
  const existingUserByUsername = await userModel.getByUsername(userData.nombre_usuario);
  if (existingUserByUsername) {
    throw createError('El nombre de usuario ya está registrado', 409);
  }
  
  // Crear el usuario con rol admin
  userData.rol = 'admin';
  const result = await userModel.create(userData);
  
  // Crear el perfil de administrador
  adminData.id_usuario = result.id_usuario;
  await adminModel.create(adminData);
  
  return { id_usuario: result.id_usuario };
}

// ----------------------------------------------------------------------
// Login de usuario
// ----------------------------------------------------------------------
async function loginUser(email, password) {
  // Buscar usuario por email
  const user = await userModel.getByEmail(email);
  if (!user) {
    throw createError('Credenciales inválidas', 401);
  }
  
  // Verificar si el usuario está activo
  if (user.estado !== 'activo') {
    throw createError('Usuario inactivo. Contacte al administrador.', 403);
  }
  
  // Verificar contraseña
  const passwordMatch = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatch) {
    throw createError('Credenciales inválidas', 401);
  }
  
  // Actualizar último login
  await userModel.updateLastLogin(user.id_usuario);
  
  // Generar token JWT
  const token = jwt.sign(
    { 
      id: user.id_usuario, 
      email: user.email,
      username: user.nombre_usuario,
      rol: user.rol 
    }, 
    JWT_SECRET, 
    { expiresIn: '24h' }
  );
  
  // Obtener perfil adicional según rol
  let perfil = null;
  if (user.rol === 'cliente') {
    perfil = await clienteModel.getByUserId(user.id_usuario);
  } else if (user.rol === 'admin') {
    perfil = await adminModel.getByUserId(user.id_usuario);
  }
  
  // Devolver datos de usuario y token (sin la contraseña)
  const { password_hash: _, ...userWithoutPassword } = user;
  return {
    user: userWithoutPassword,
    perfil,
    token
  };
}

// ----------------------------------------------------------------------
// Actualizar perfil de usuario cliente
// ----------------------------------------------------------------------
async function updateClienteProfile(id, userData, clienteData) {
  // Verificar si el usuario existe
  const user = await userModel.getById(id);
  if (!user) {
    throw createError('Usuario no encontrado', 404);
  }
  
  // Verificar si es un cliente
  if (user.rol !== 'cliente') {
    throw createError('El usuario no es un cliente', 403);
  }
  
  // Si se está actualizando el email, verificar que no exista ya
  if (userData.email && userData.email !== user.email) {
    const existingUser = await userModel.getByEmail(userData.email);
    if (existingUser) {
      throw createError('El email ya está registrado por otro usuario', 409);
    }
  }
  
  // Si se está actualizando el nombre de usuario, verificar que no exista ya
  if (userData.nombre_usuario && userData.nombre_usuario !== user.nombre_usuario) {
    const existingUser = await userModel.getByUsername(userData.nombre_usuario);
    if (existingUser) {
      throw createError('El nombre de usuario ya está registrado por otro usuario', 409);
    }
  }
  
  // Actualizar usuario
  await userModel.update(id, userData);
  
  // Obtener el perfil de cliente
  const cliente = await clienteModel.getByUserId(id);
  if (!cliente) {
    throw createError('Perfil de cliente no encontrado', 404);
  }
  
  // Actualizar perfil de cliente
  await clienteModel.update(cliente.id_cliente, clienteData);
  
  return await getUserById(id);
}

// ----------------------------------------------------------------------
// Actualizar perfil de usuario administrador
// ----------------------------------------------------------------------
async function updateAdminProfile(id, userData, adminData) {
  // Verificar si el usuario existe
  const user = await userModel.getById(id);
  if (!user) {
    throw createError('Usuario no encontrado', 404);
  }
  
  // Verificar si es un administrador
  if (user.rol !== 'admin') {
    throw createError('El usuario no es un administrador', 403);
  }
  
  // Si se está actualizando el email, verificar que no exista ya
  if (userData.email && userData.email !== user.email) {
    const existingUser = await userModel.getByEmail(userData.email);
    if (existingUser) {
      throw createError('El email ya está registrado por otro usuario', 409);
    }
  }
  
  // Si se está actualizando el nombre de usuario, verificar que no exista ya
  if (userData.nombre_usuario && userData.nombre_usuario !== user.nombre_usuario) {
    const existingUser = await userModel.getByUsername(userData.nombre_usuario);
    if (existingUser) {
      throw createError('El nombre de usuario ya está registrado por otro usuario', 409);
    }
  }
  
  // Actualizar usuario
  await userModel.update(id, userData);
  
  // Obtener el perfil de administrador
  const admin = await adminModel.getByUserId(id);
  if (!admin) {
    throw createError('Perfil de administrador no encontrado', 404);
  }
  
  // Actualizar perfil de administrador
  await adminModel.update(admin.id_admin, adminData);
  
  return await getUserById(id);
}

// ----------------------------------------------------------------------
// Cambiar contraseña
// ----------------------------------------------------------------------
async function changePassword(id, currentPassword, newPassword) {
  // Verificar si el usuario existe
  const user = await userModel.getById(id);
  if (!user) {
    throw createError('Usuario no encontrado', 404);
  }
  
  // Obtener usuario completo con contraseña
  const userWithPassword = await userModel.getByEmail(user.email);
  
  // Verificar contraseña actual
  const passwordMatch = await bcrypt.compare(currentPassword, userWithPassword.password_hash);
  if (!passwordMatch) {
    throw createError('La contraseña actual es incorrecta', 401);
  }
  
  // Actualizar contraseña
  const updated = await userModel.updatePassword(id, newPassword);
  if (!updated) {
    throw createError('Error al cambiar la contraseña', 400);
  }
  
  return { success: true };
}

// ----------------------------------------------------------------------
// Cambiar estado de usuario (activo/inactivo) - solo para administradores
// ----------------------------------------------------------------------
async function deleteUser(id) {
  // Verificar si el usuario existe
  const user = await userModel.getById(id);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  
  // Cambiar estado del usuario (activo/inactivo)
  const updated = await userModel.remove(id);
  if (!updated) {
    throw new Error('Error al cambiar el estado del usuario');
  }
  
  // Determinar el nuevo estado para el mensaje de respuesta
  const nuevoEstado = user.estado === 'activo' ? 'inactivo' : 'activo';
  
  return { 
    success: true, 
    message: `Usuario ${nuevoEstado === 'inactivo' ? 'desactivado' : 'activado'} exitosamente`,
    nuevoEstado 
  };
}

module.exports = {
  getAllUsers,
  getUserById,
  registerCliente,
  registerAdmin,
  loginUser,
  updateClienteProfile,
  updateAdminProfile,
  changePassword,
  deleteUser
};
// Helper para crear errores con código HTTP
function createError(message, status) {
  const err = new Error(message);
  err.status = status;
  return err;
}