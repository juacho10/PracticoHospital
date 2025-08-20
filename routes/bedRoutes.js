const express = require('express');
const router = express.Router();
const { ensureAuthenticated, requireRole } = require('../middleware/auth');
const bedController = require('../controllers/bedController');

router.get('/list', ensureAuthenticated, requireRole(['admin']), bedController.listBeds);
router.post('/update-status', ensureAuthenticated, requireRole(['admin']), bedController.updateBedStatus);
router.get('/create', ensureAuthenticated, requireRole(['admin']), bedController.createBedForm);
router.post('/create', ensureAuthenticated, requireRole(['admin']), bedController.createBed);
router.get('/delete/:id', ensureAuthenticated, requireRole(['admin']), bedController.deleteBed);

module.exports = router;