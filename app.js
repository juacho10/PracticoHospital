require('dotenv').config();
const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const path = require('path');
const flash = require('connect-flash');
const { pool } = require('./config/database');

const app = express();

// Configuración
app.set('trust proxy', 1); // Para cookies seguras en producción
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

pool.query('SELECT NOW()')
  .then(() => console.log('✅ Conexión a PostgreSQL verificada'))
  .catch(err => console.error('❌ Error de conexión a PostgreSQL:', err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de sesión
const sessionStore = new pgSession({
  pool: pool,
  tableName: 'session',
  createTableIfMissing: true,
  ttl: 86400,
  pruneSessionInterval: false,
  errorLog: console.error
});

app.use(session({
  store: sessionStore,
  secret: process.env.SESSION_SECRET || 'fallback-secret-key',
  resave: false,
  saveUninitialized: false,
  proxy: true, // ✅ IMPORTANTE para producción
  cookie: {
    secure: process.env.NODE_ENV === 'production', // ✅ true solo en producción
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // ✅ 'none' para producción
    domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : 'localhost' // ✅ dominio correcto
  }
}));


app.use(flash());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
// Variables globales
app.use((req, res, next) => {
  console.log('Sesión actual:', req.session);
  next();
});

// Rutas
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/authRoutes');
const admissionRoutes = require('./routes/admissionRoutes');
const patientRoutes = require('./routes/patientRoutes');
const bedRoutes = require('./routes/bedRoutes');

app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/admission', admissionRoutes);
app.use('/patient', patientRoutes);
app.use('/bed', bedRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    title: 'Error',
    message: 'Algo salió mal!'
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});