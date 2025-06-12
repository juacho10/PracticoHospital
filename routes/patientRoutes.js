const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const patientController = require('../controllers/patientController');
const Patient = require('../models/Patient'); // Añadir esta importación

router.get('/list', ensureAuthenticated, patientController.listPatients);
router.get('/edit/:id', ensureAuthenticated, patientController.editForm);
router.post('/update/:id', ensureAuthenticated, patientController.updatePatient);
router.get('/delete/:id', ensureAuthenticated, patientController.deletePatient);

// Nueva ruta para búsqueda de pacientes por DNI
router.get('/api/search', ensureAuthenticated, async (req, res) => {
    console.log('Búsqueda recibida para DNI:', req.query.dni);
    try {
        const { dni } = req.query;
        if (!dni) {
            console.log('DNI no proporcionado');
            return res.status(400).json({ error: 'Se requiere el parámetro DNI' });
        }

        console.log('Buscando paciente con DNI:', dni);
        const patient = await Patient.findByDni(dni);
        console.log('Resultado de la búsqueda:', patient);

        if (!patient) {
            console.log('Paciente no encontrado');
            return res.status(404).json({ error: 'Paciente no encontrado' });
        }

        console.log('Paciente encontrado:', patient.id);
        res.json({ patient });
    } catch (error) {
        console.error('Error completo en búsqueda:', {
            message: error.message,
            stack: error.stack,
            query: req.query
        });
        res.status(500).json({ 
            error: 'Error en la búsqueda del paciente',
            details: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
});
module.exports = router;