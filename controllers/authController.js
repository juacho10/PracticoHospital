const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.loginForm = (req, res) => {
  res.render('auth/login', {
    title: 'Iniciar Sesión',
    username: req.flash('username') // Para mantener el username en errores
  });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      req.flash('error', 'Usuario y contraseña son requeridos');
      return res.redirect('/auth/login');
    }

    const user = await User.findByUsername(username);
    if (!user) {
      req.flash('error', 'Credenciales inválidas');
      return res.redirect('/auth/login');
    }

    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      req.flash('error', 'Credenciales inválidas');
      return res.redirect('/auth/login');
    }

    // ✅ Sesión simplificada y robusta
    req.session.user = {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      role: user.role
    };

    req.session.save((err) => {
      if (err) {
        console.error('Error al guardar sesión:', err);
        req.flash('error', 'Error del servidor');
        return res.redirect('/auth/login');
      }
      
      req.flash('success', `Bienvenido ${user.full_name}`);
      return res.redirect('/');
    });

  } catch (error) {
    console.error('Error en login:', error);
    req.flash('error', 'Error del servidor');
    res.redirect('/auth/login');
  }
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
    }
    res.clearCookie('connect.sid');
    res.redirect('/auth/login');
  });
};