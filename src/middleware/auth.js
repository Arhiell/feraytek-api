const jwt = require("jsonwebtoken");
const config = require("../config/config");
const userModel = require("../models/user.model");

// Verificar token JWT
function verifyToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Token inválido o expirado" });
  }
}

// Verificar si es administrador
function isAdmin(req, res, next) {
  if (req.user.rol !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Acceso denegado. Se requiere rol de administrador",
    });
  }
  next();
}

// Verificar si es el propietario del recurso o un administrador
async function isOwnerOrAdmin(req, res, next) {
  const userId = parseInt(req.params.id);

  // Si es administrador, permitir acceso
  if (req.user.rol === "admin") {
    return next();
  }

  // Si es el propietario del recurso, permitir acceso
  if (req.user.id === userId) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Acceso denegado. No tienes permisos para este recurso",
  });
}

module.exports = {
  verifyToken,
  isAdmin,
  isOwnerOrAdmin,
};
