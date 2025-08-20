const ensureAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    req.flash('error', 'Por favor inicie sesión para acceder a esta página');
    return res.redirect('/auth/login');
  }
  next();
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.session.user) {
      req.flash('error', 'Por favor inicie sesión para acceder a esta página');
      return res.redirect('/auth/login');
    }
    
    if (!roles.includes(req.session.user.role)) {
      req.flash('error', 'No tienes permisos para acceder a esta sección');
      return res.redirect('/');
    }
    
    next();
  };
};

// Exporta ambas funciones correctamente
module.exports = {
  ensureAuthenticated,
  requireRole
};