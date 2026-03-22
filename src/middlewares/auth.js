function attachUser(req, res, next) {
  res.locals.currentUser = req.session.user || null;
  res.locals.success = req.session.success || null;
  res.locals.error = req.session.error || null;
  delete req.session.success;
  delete req.session.error;
  next();
}

function requireAuth(req, res, next) {
  if (!req.session.user) {
    req.session.error = 'Debes iniciar sesión para continuar.';
    return res.redirect('/login');
  }
  next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.session.user) {
      req.session.error = 'Debes iniciar sesión para continuar.';
      return res.redirect('/login');
    }
    if (!roles.includes(req.session.user.role)) {
      req.session.error = 'No tienes permisos para acceder a esta sección.';
      return res.redirect('/dashboard');
    }
    next();
  };
}

module.exports = { attachUser, requireAuth, requireRole };
