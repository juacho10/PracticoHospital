const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const bedController = require('../controllers/bedController');

router.get('/list', ensureAuthenticated, bedController.listBeds);
router.post('/update-status', ensureAuthenticated, bedController.updateBedStatus);
router.get('/create', ensureAuthenticated, bedController.createBedForm);
router.post('/create', ensureAuthenticated, bedController.createBed);
router.get('/delete/:id', ensureAuthenticated, bedController.deleteBed);

module.exports = router;