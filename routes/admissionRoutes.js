const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const admissionController = require('../controllers/admissionController');

router.get('/register', ensureAuthenticated, admissionController.registerForm);
router.post('/register', ensureAuthenticated, admissionController.registerPatient);
router.get('/assign-bed/:id', ensureAuthenticated, admissionController.assignBedForm);
router.post('/assign-bed', ensureAuthenticated, admissionController.assignBed);
router.get('/list', ensureAuthenticated, admissionController.listAdmissions);
router.post('/discharge/:id', ensureAuthenticated, admissionController.dischargePatient);

module.exports = router;
