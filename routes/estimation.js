const express = require('express');
const router = express.Router();
const estimationCtrl = require('../controllers/estimation');
const auth = require('../middleware/auth');

// ROUTES //

router.post('/ajouter', estimationCtrl.envoyerEstimation);
router.post('/message', estimationCtrl.envoyerMessage);



module.exports = router;