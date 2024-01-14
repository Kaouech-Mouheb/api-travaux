const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/auth');
const auth = require('../middleware/auth')


// ROUTES //

router.post('/signup', userCtrl.register);
router.get('/', userCtrl.getCompte);

router.post('/signin', userCtrl.login);
router.put('/update', auth, userCtrl.updateNewPassword);
router.put('/changepassword', auth, userCtrl.changePassword);

router.put('/email', auth, userCtrl.updateNewEmail);

router.put('/profil', auth, userCtrl.upedateProfil);






/* EXPORT */
module.exports = router;
