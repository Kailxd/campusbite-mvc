const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

async function index(req, res) {
  const users = await User.getAll();
  res.render('users/index', { title: 'Usuarios', users });
}

function createForm(req, res) {
  res.render('users/form', { title: 'Nuevo usuario', user: null, action: '/usuarios', method: 'POST' });
}

async function store(req, res) {
  try {
    const { full_name, email, password, role } = req.body;
    const password_hash = await bcrypt.hash(password, 10);
    await User.create({ full_name, email: email.trim().toLowerCase(), password_hash, role });
    req.session.success = 'Usuario creado correctamente.';
    res.redirect('/usuarios');
  } catch (error) {
    req.session.error = 'No se pudo crear el usuario. Verifica que el correo no esté repetido.';
    res.redirect('/usuarios/nuevo');
  }
}

async function editForm(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) {
    req.session.error = 'Usuario no encontrado.';
    return res.redirect('/usuarios');
  }
  res.render('users/form', { title: 'Editar usuario', user, action: `/usuarios/${user.id}?_method=PUT`, method: 'POST' });
}

async function update(req, res) {
  try {
    const { full_name, email, role } = req.body;
    await User.update(req.params.id, { full_name, email: email.trim().toLowerCase(), role });
    req.session.success = 'Usuario actualizado correctamente.';
    res.redirect('/usuarios');
  } catch (error) {
    req.session.error = 'No se pudo actualizar el usuario.';
    res.redirect(`/usuarios/${req.params.id}/editar`);
  }
}

async function destroy(req, res) {
  try {
    if (Number(req.params.id) === req.session.user.id) {
      req.session.error = 'No puedes eliminar tu propio usuario mientras estás logueado.';
      return res.redirect('/usuarios');
    }
    await User.remove(req.params.id);
    req.session.success = 'Usuario eliminado correctamente.';
  } catch (error) {
    req.session.error = 'No se pudo eliminar el usuario.';
  }
  res.redirect('/usuarios');
}

module.exports = { index, createForm, store, editForm, update, destroy };
