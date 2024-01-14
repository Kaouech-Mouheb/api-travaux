const express = require('express');
const router = express.Router();
const annanceCtrl = require('../controllers/annance');
const auth = require('../middleware/auth');

// ROUTES //

router.post('/ajouter', annanceCtrl.createAnnance);
router.get('/', auth, annanceCtrl.getAnnonce);

router.put('/update/:id', auth, annanceCtrl.updateAnnonce);


/* EXPORT */
module.exports = router;
