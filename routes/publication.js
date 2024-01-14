const express = require('express');
const router = express.Router();
const publicationCtrl = require('../controllers/publication');
const auth = require('../middleware/auth');

// ROUTES //

router.post('/ajouter', publicationCtrl.createPublication);
router.get('/', auth, publicationCtrl.getPublication);

router.delete('/:id', auth, publicationCtrl.deletePublication);


/* EXPORT */
module.exports = router;
