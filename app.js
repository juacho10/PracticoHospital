const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
require('dotenv').config();

const app = express();

// Configuración
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Rutas
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/authRoutes');
const admissionRoutes = require('./routes/admissionRoutes');
const patientRoutes = require('./routes/patientRoutes'); 

const bedRoutes = require('./routes/bedRoutes');
app.use('/bed', bedRoutes);

app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/admission', admissionRoutes);
app.use('/patient', patientRoutes); 

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

