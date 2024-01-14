const express = require('express');
const router = express.Router();
const plansCtrl = require('../controllers/plans');
const auth = require('../middleware/auth');

// ROUTES //

router.put('/ajouter', auth, plansCtrl.miseAjour);
router.put('/state', plansCtrl.miseAjourState);



/* EXPORT */ 
module.exports = router;