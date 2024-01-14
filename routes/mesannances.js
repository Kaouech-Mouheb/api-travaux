const express = require('express');
const router = express.Router();
const mesannanceCtrl = require('../controllers/mesannances');
const auth = require('../middleware/auth');

// ROUTES //

router.post('/ajouter', auth, mesannanceCtrl.createMesannance);
router.get('/', auth, mesannanceCtrl.getMesannance);
router.get('/:id', auth, mesannanceCtrl.getOneMesannance);


/* EXPORT */
module.exports = router;
