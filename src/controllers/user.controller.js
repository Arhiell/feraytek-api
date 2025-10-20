// ======================================================================
// Controlador de Usuario
// Maneja las solicitudes HTTP relacionadas con usuarios y autenticación
// ======================================================================

const userService = require('../services/user.service');

// ----------------------------------------------------------------------
// Obtener todos los usuarios (solo para administradores)
// ----------------------------------------------------------------------
async function getAllUsers(req, res, next) {
  try {
    const users = await userService.getAllUsers();
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------------------------
// Obtener un usuario por ID
// ----------------------------------------------------------------------
async function getUserById(req, res, next) {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------------------------
// Registro de cliente
// ----------------------------------------------------------------------
async function registerCliente(req, res, next) {
  try {
    const { nombre_usuario, email, password, dni, nombre, apellido, telefono, direccion, ciudad, provincia, pais, codigo_postal, fecha_nacimiento } = req.body;
    
    // Datos para la tabla usuarios
    const userData = { nombre_usuario, email, password };
    
    // Datos para la tabla clientes
    const clienteData = { dni, nombre, apellido, telefono, direccion, ciudad, provincia, pais, codigo_postal, fecha_nacimiento };
    
    const result = await userService.registerCliente(userData, clienteData);
    res.status(201).json({ success: true, message: 'Cliente registrado exitosamente', data: result });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------------------------
// Registro de administrador (solo para superadmins)
// ----------------------------------------------------------------------
async function registerAdmin(req, res, next) {
  try {
    const { nombre_usuario, email, password, dni, nombre, apellido, telefono, cargo } = req.body;
    
    // Datos para la tabla usuarios
    const userData = { nombre_usuario, email, password };
    
    // Datos para la tabla administradores
    const adminData = { dni, nombre, apellido, telefono, cargo };
    
    const result = await userService.registerAdmin(userData, adminData);
    res.status(201).json({ success: true, message: 'Administrador registrado exitosamente', data: result });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------------------------
// Login de usuario
// ----------------------------------------------------------------------
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await userService.loginUser(email, password);
    res.json({ success: true, message: 'Login exitoso', ...result });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------------------------
// Actualizar perfil de cliente
// ----------------------------------------------------------------------
async function updateClienteProfile(req, res, next) {
  try {
    const { id } = req.params;
    const { nombre_usuario, email, estado, dni, nombre, apellido, telefono, direccion, ciudad, provincia, pais, codigo_postal, fecha_nacimiento } = req.body;
    
    // Datos para la tabla usuarios
    const userData = { nombre_usuario, email, estado };
    
    // Datos para la tabla clientes
    const clienteData = { dni, nombre, apellido, telefono, direccion, ciudad, provincia, pais, codigo_postal, fecha_nacimiento };
    
    const result = await userService.updateClienteProfile(id, userData, clienteData);
    res.json({ success: true, message: 'Perfil actualizado exitosamente', data: result });
  } catch (error) {
    next(error);
  }
}

// Actualizar datos del ususario propio//
async function actualizarUsuario(req, res, next) {
  try {
    const { id } = req.params;
    const { nombre_usuario, email, password } = req.body;

    if (!nombre_usuario || !email || !password)
      return res.status(400).json({ message: 'Faltan datos obligatorios' });

    const result = await userService.updateBasicUser(id, { nombre_usuario, email, password });
    res.status(200).json({ message: 'Usuario actualizado correctamente', data: result });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------------------------
// Actualizar perfil de administrador
// ----------------------------------------------------------------------
async function updateAdminProfile(req, res, next) {
  try {
    const { id } = req.params;
    const { nombre_usuario, email, estado, dni, nombre, apellido, telefono, cargo } = req.body;
    
    // Datos para la tabla usuarios
    const userData = { nombre_usuario, email, estado };
    
    // Datos para la tabla administradores
    const adminData = { dni, nombre, apellido, telefono, cargo };
    
    const result = await userService.updateAdminProfile(id, userData, adminData);
    res.json({ success: true, message: 'Perfil actualizado exitosamente', data: result });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------------------------
// Cambiar contraseña
// ----------------------------------------------------------------------
async function changePassword(req, res, next) {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    
    const result = await userService.changePassword(id, currentPassword, newPassword);
    res.json({ success: true, message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------------------------
// Cambiar estado de usuario (activo/inactivo) - solo para administradores
// ----------------------------------------------------------------------
async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    const result = await userService.deleteUser(id);
    res.json({ 
      success: true, 
      message: result.message,
      nuevoEstado: result.nuevoEstado 
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  registerCliente,
  registerAdmin,
  login,
  updateClienteProfile,
  updateAdminProfile,
  changePassword,
  deleteUser
};