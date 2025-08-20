const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/', ensureAuthenticated, (req, res) => {
  res.render('index', {
    title: 'Sistema de Admisión Hospitalaria',
    user: req.session.user
  });
});

module.exports = router;
