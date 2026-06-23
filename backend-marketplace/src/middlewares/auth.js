exports.authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
      // Para simplificar el laboratorio sin JWT complejos, enviaremos el rol en los headers
      const userRole = req.headers['x-role']; 
  
      if (!userRole) {
        return res.status(401).json({ success: false, message: 'No autenticado. Falta el header x-role' });
      }
  
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ success: false, message: 'Acceso prohibido: No tienes los permisos requeridos' });
      }
  
      next();
    };
  };