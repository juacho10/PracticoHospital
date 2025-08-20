const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const patientController = require('../controllers/patientController');
const Patient = require('../models/Patient');

// API para búsqueda de pacientes
router.get('/api/search', ensureAuthenticated, async (req, res) => {
  try {
    const { dni } = req.query;
    if (!dni) {
      return res.status(400).json({ error: 'DNI es requerido' });
    }
    
    const patient = await Patient.findByDni(dni);
    if (!patient) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }
    
    res.json({ patient });
  } catch (error) {
    console.error('Error en búsqueda de paciente:', error);
    res.status(500).json({ error: 'Error al buscar paciente' });
  }
});
// Rutas principales
router.get('/list', ensureAuthenticated, patientController.listPatients);
router.get('/edit/:id', ensureAuthenticated, patientController.editForm);
router.post('/update/:id', ensureAuthenticated, patientController.updatePatient);
router.get('/delete/:id', ensureAuthenticated, patientController.deletePatient);

module.exports = router;