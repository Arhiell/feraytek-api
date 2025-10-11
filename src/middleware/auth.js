/**
 * ===============================================
 * Middleware: auth
 * Descripción: (Pendiente de implementación)
 * Validará el token JWT y roles (cliente/admin).
 * ===============================================
 */

// Mas adelante implementaremos la logica de auth (LEO FIJATE EN ESTE APARTADO)
function authMiddleware(req, res, next) {
  // TODO: implementar validación JWT
  next();
}

module.exports = authMiddleware;
