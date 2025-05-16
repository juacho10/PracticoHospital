const User = require('../models/User');

exports.loginForm = (req, res) => {
    res.render('auth/login', { title: 'Iniciar Sesión' });
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const user = await User.findByUsername(username);
        
        if (!user) {
            return res.render('auth/login', { 
                title: 'Iniciar Sesión', 
                error: 'Usuario o contraseña incorrectos' 
            });
        }
        
        const isMatch = await User.comparePassword(password, user.password);
        
        if (!isMatch) {
            return res.render('auth/login', { 
                title: 'Iniciar Sesión', 
                error: 'Usuario o contraseña incorrectos' 
            });
        }
        
        req.session.user = user;
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.render('auth/login', { 
            title: 'Iniciar Sesión', 
            error: 'Error al iniciar sesión' 
        });
    }
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login');
};