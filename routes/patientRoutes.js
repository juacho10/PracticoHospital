const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const patientController = require('../controllers/patientController');

router.get('/list', ensureAuthenticated, patientController.listPatients);
router.get('/edit/:id', ensureAuthenticated, patientController.editForm);
router.post('/update/:id', ensureAuthenticated, patientController.updatePatient);
router.get('/delete/:id', ensureAuthenticated, patientController.deletePatient);


module.exports = router;