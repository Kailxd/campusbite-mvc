const bcrypt = require('bcrypt');
const User = require('../models/userModel');

function showLogin(req, res) {
  res.render('auth/login', { title: 'Iniciar sesión' });
}

function showRegister(req, res) {
  res.render('auth/register', { title: 'Registro' });
}

async function register(req, res) {
  try {
    const { full_name, email, password, confirm_password } = req.body;
    if (!full_name || !email || !password || !confirm_password) {
      req.session.error = 'Completa todos los campos.';
      return res.redirect('/register');
    }
    if (password !== confirm_password) {
      req.session.error = 'Las contraseñas no coinciden.';
      return res.redirect('/register');
    }
    const existing = await User.findByEmail(email.trim().toLowerCase());
    if (existing) {
      req.session.error = 'Ese correo ya está registrado.';
      return res.redirect('/register');
    }
    const password_hash = await bcrypt.hash(password, 10);
    await User.create({
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      password_hash,
      role: 'estudiante'
    });
    req.session.success = 'Registro exitoso. Ahora inicia sesión.';
    res.redirect('/login');
  } catch (error) {
    req.session.error = 'No se pudo completar el registro.';
    res.redirect('/register');
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail((email || '').trim().toLowerCase());
    if (!user) {
      req.session.error = 'Credenciales inválidas.';
      return res.redirect('/login');
    }
    const ok = await bcrypt.compare(password || '', user.password_hash);
    if (!ok) {
      req.session.error = 'Credenciales inválidas.';
      return res.redirect('/login');
    }
    req.session.user = { id: user.id, full_name: user.full_name, email: user.email, role: user.role };
    req.session.success = `Bienvenido, ${user.full_name}.`;
    res.redirect('/dashboard');
  } catch (error) {
    req.session.error = 'No se pudo iniciar sesión.';
    res.redirect('/login');
  }
}

function logout(req, res) {
  req.session.destroy(() => {
    res.redirect('/login');
  });
}

module.exports = { showLogin, showRegister, register, login, logout };
